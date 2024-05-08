import { PageContainer } from "~/components/layout/PageContainer";
import { Title } from "~/components/ui/title";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import { HeadMetaData } from "~/components/layout/HeadMetaData";
import React from "react";
import { db } from "~/server/db";
import { Section } from "~/components/layout/Section";
import { QuestionCard, AskQuestionForm } from "~/features/ask/components";
import { type AskQuestionFormSchema } from "~/features/ask/forms";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type UserPageProps = {
  username: string;
  name: string;
};

const UserPage: React.FC<UserPageProps> = ({ username, name }) => {
  const { data: user } = api.user.getUser.useQuery(
    {
      username,
    },
    {
      enabled: !!username,
    },
  );
  const { mutate: createQuestion, isPending } =
    api.ask.createQuestion.useMutation({
      onError: ({ message }) => {
        toast.error(message);
      },
      onSuccess: () => {
        toast.success("Question submitted to creator 🚀", {
          position: "top-right",
        });
      },
    });
  const {
    data: getQuestionsResponse,
    fetchNextPage,
    isLoading: getQuestionsIsLoading,
    refetch: refetchQuestions,
  } = api.ask.getQuestions.useInfiniteQuery(
    {
      limit: 5,
      userId: user?.id ?? "",
    },
    {
      getNextPageParam: ({ nextCursor, hasNext }) => {
        if (hasNext) {
          return nextCursor;
        }
      },
      enabled: Boolean(user),
    },
  );

  const createQuestionHandler = (values: AskQuestionFormSchema) => {
    createQuestion({
      body: values.body,
      toUserId: user!.id,
    });
  };

  return (
    <PageContainer className="lg:max-w-screen-md">
      {/* TODO: Add OG image from user's profile picture, needs a bit of design */}
      <HeadMetaData title={`${name} (@${username})`} />

      <div className="grid grid-cols-12">
        {/* USER INFO SECTION */}
        <div className="col-span-full mb-4 flex h-fit flex-col gap-3 bg-background p-4 lg:mb-0 lg:border-x-2 lg:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-[100px] w-[100px] border-[2px]">
              <AvatarFallback className="bg-accent">
                <span className="text-4xl font-bold">
                  {user?.name?.charAt(0)}
                </span>
              </AvatarFallback>
              <AvatarImage src={user?.image ?? ""} />
            </Avatar>

            <div>
              <Title className="max-w-72 text-center">{user?.name}</Title>
              <p className="text-lg font-bold">@{user?.username}</p>
            </div>
          </div>

          {/* Bio */}
          {user?.bio && <p>{user.bio}</p>}
        </div>

        <div className="col-span-full border-t-2 ">
          {/* ASK INPUT */}
          <AskQuestionForm
            loading={isPending}
            onSubmit={createQuestionHandler}
          />

          <Section title="Feed" className="h-full border-b-0 px-0">
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by: Latest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select> */}
            <div className="mt-2 flex flex-col gap-2 px-4 pb-4 lg:px-0">
              {getQuestionsResponse?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((question) => (
                    <QuestionCard
                      key={question.id}
                      createdAt={question.createdAt}
                      username={question.askedBy.username ?? ""}
                      avatarUrl={question.askedBy.image ?? ""}
                      body={question.body}
                      upvotes={undefined}
                    />
                  ))}
                </React.Fragment>
              ))}
              {getQuestionsResponse?.pages[
                getQuestionsResponse.pages.length - 1
              ]?.hasNext &&
                (getQuestionsIsLoading ? (
                  "Loading..."
                ) : (
                  <Button
                    onClick={() => fetchNextPage()}
                    className="w-fit self-center"
                    variant="secondary"
                  >
                    See more
                  </Button>
                ))}
            </div>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  { username: string }
> = async ({ params }) => {
  if (!params?.username) {
    return {
      notFound: true,
    };
  }

  const profile = await db.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      username: profile.username ?? "",
      name: profile.name ?? "",
    },
  };
};

export default UserPage;
