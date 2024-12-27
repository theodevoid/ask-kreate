import { type ReactElement } from "react";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import {
  DashboardSection,
  DashboardSectionContent,
} from "~/components/layout/DashboardSection";
import { Card, CardContent } from "~/components/ui/card";
import { type NextPageWithLayout } from "~/pages/_app";
import { SessionInfoCard } from "../components/SessionInfoCard";
import { QuestionCard } from "../components/QuestionCard";
import { api } from "~/utils/api";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { QuestionsGridList } from "~/features/question-session/components/QuestionsGridList";

const mockQuestions = [
  {
    id: "1",
    username: "Alice Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "What new features can we expect in this product launch?",
    timestamp: new Date(2023, 5, 2, 10, 30),
    likes: 5,
  },
  {
    id: "2",
    username: "Bob Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Will there be a beta testing phase for early adopters?",
    timestamp: new Date(2023, 5, 2, 11, 15),
    likes: 3,
  },
  {
    id: "3",
    username: "Charlie Brown",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "How does this product compare to your competitors?",
    timestamp: new Date(2023, 5, 2, 14, 0),
    likes: 7,
  },
];

const DashboardSessionDetailPage: NextPageWithLayout = () => {
  const params = useParams();

  const getSessionDetailsQuery = api.questionSession.getById.useQuery(
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

  return (
    <div>
      <div className="mb-8 flex flex-col">
        {getSessionDetailsQuery.data && (
          <SessionInfoCard
            code={getSessionDetailsQuery.data?.code}
            title={getSessionDetailsQuery.data?.title}
            startDate={getSessionDetailsQuery.data?.startDate}
            endDate={getSessionDetailsQuery.data?.endDate}
            isActive={getSessionDetailsQuery.data?.isActive}
          />
        )}
      </div>

      <div>
        <h4 className="mb-4 text-2xl font-semibold">Questions</h4>
        <Tabs defaultValue="popular">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:bg-transparent"
                value="popular"
              >
                Popular
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-transparent"
                value="recent"
              >
                Recent
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              {getSessionDetailsQuery.data?.estimatedQuestionCount} Questions
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
    </div>
  );
};

DashboardSessionDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardSessionDetailPage;
