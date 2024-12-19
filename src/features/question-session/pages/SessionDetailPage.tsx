import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { SessionInfoCard } from "~/features/dashboard/components/SessionInfoCard";
import { api } from "~/utils/api";
import {
  type AskQuestionFormSchema,
  askQuestionFormSchema,
} from "../forms/ask-question";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useAnonymousAuth } from "~/hooks/useAnonymousAuth";
import { useQueryClient } from "@tanstack/react-query";
import { QuestionCard } from "~/features/dashboard/components/QuestionCard";

const SessionDetailPage = () => {
  const QUESTION_CHARACTER_LIMIT = 280;

  useAnonymousAuth();

  const params = useParams();

  const apiClient = api.useUtils();

  const form = useForm<AskQuestionFormSchema>({
    resolver: zodResolver(askQuestionFormSchema),
  });

  const { data } = api.questionSession.getById.useQuery(
    {
      id: params?.sessionId as string,
    },
    {
      enabled: !!params?.sessionId,
    },
  );

  const createQuestionMutation = api.questionSession.createQuestion.useMutation(
    {
      onSuccess: async () => {
        await apiClient.questionSession.getById.invalidate({
          id: params.sessionId as string,
        });
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
              <div className="grid grid-cols-1 gap-4">
                {data?.questions.map((question) => {
                  return (
                    <QuestionCard
                      content={question.body}
                      likes={0}
                      timestamp={question.createdAt}
                      userAvatar=""
                      username={question.name ?? ""}
                      id={question.id}
                      key={question.id}
                    />
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="recent">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default SessionDetailPage;
