import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { SessionInfoCard } from "~/features/dashboard/components/SessionInfoCard";
import { useAnonymousAuth } from "~/hooks/useAnonymousAuth";
import { api } from "~/utils/api";
import { QuestionsGridList } from "../components/QuestionsGridList";
import {
  type AskQuestionFormSchema,
  askQuestionFormSchema,
} from "../forms/ask-question";
import { toast } from "sonner";

const SessionDetailPage = () => {
  const QUESTION_CHARACTER_LIMIT = 280;

  useAnonymousAuth();

  const params = useParams();

  const apiUtils = api.useUtils();

  const form = useForm<AskQuestionFormSchema>({
    resolver: zodResolver(askQuestionFormSchema),
  });

  const invalidateGetQuestionQueries = async () => {
    await Promise.all([
      apiUtils.questionSession.getQuestionsBySessionId.invalidate({
        sessionId: params?.sessionId as string,
        sortBy: "popular",
      }),
      apiUtils.questionSession.getQuestionsBySessionId.invalidate({
        sessionId: params?.sessionId as string,
        sortBy: "recent",
      }),
    ]);
  };

  const { data } = api.questionSession.getById.useQuery(
    {
      id: params?.sessionId as string,
    },
    {
      enabled: !!params?.sessionId,
    },
  );

  const getPopularQuestionsBySessionIdQuery =
    api.questionSession.getQuestionsBySessionId.useQuery(
      {
        sessionId: params?.sessionId as string,
        sortBy: "popular",
      },
      {
        enabled: !!params?.sessionId,
      },
    );

  const getRecentQuestionsBySessionIdQuery =
    api.questionSession.getQuestionsBySessionId.useQuery(
      {
        sessionId: params?.sessionId as string,
        sortBy: "recent",
      },
      {
        enabled: !!params?.sessionId,
      },
    );

  const createQuestionMutation = api.questionSession.createQuestion.useMutation(
    {
      onSuccess: async () => {
        await invalidateGetQuestionQueries();
        form.setValue("body", "");
        form.setValue("name", "");
        toast("Message sent🚀", { position: "top-center" });
      },
    },
  );

  const handleSubmitQuestion = (values: AskQuestionFormSchema) => {
    createQuestionMutation.mutate({
      ...values,
      questionSessionId: params.sessionId as string,
    });
  };

  return (
    <PageContainer>
      <SectionContainer className="min-h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col items-center gap-8 p-4 py-8">
        {data && (
          <SessionInfoCard
            className="w-full border-0 shadow-none"
            contentClassName="p-0"
            headerClassName="p-0"
            code={data?.code}
            title={data?.title}
            startDate={data?.startDate}
            endDate={data?.endDate}
            isActive={data?.isActive}
          />
        )}

        <div className="flex w-full flex-col gap-y-4 rounded-lg border p-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="resize-none border-0 bg-background p-0 text-lg"
                      placeholder="Type your question"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {QUESTION_CHARACTER_LIMIT - (field.value?.length ?? 0)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your name (optional)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                onClick={form.handleSubmit(handleSubmitQuestion)}
                className="self-end"
                disabled={createQuestionMutation.isPending}
              >
                Send Question
              </Button>
            </div>
          </Form>
        </div>

        <div className="w-full">
          <Tabs defaultValue="popular">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground">
                {data?.estimatedQuestionCount} Questions
              </div>
            </div>

            <TabsContent value="popular">
              {getPopularQuestionsBySessionIdQuery.data ? (
                <QuestionsGridList
                  questions={getPopularQuestionsBySessionIdQuery.data}
                />
              ) : (
                <p>Loading...</p>
              )}
            </TabsContent>
            <TabsContent value="recent">
              {getRecentQuestionsBySessionIdQuery.data ? (
                <QuestionsGridList
                  questions={getRecentQuestionsBySessionIdQuery.data}
                />
              ) : (
                <p>Loading...</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default SessionDetailPage;
