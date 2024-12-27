import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  type ReactElement,
} from "react";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { QuestionsGridList } from "~/features/question-session/components/QuestionsGridList";
import { supabaseDefaultClient } from "~/lib/supabase/client";
import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { SessionInfoCard } from "../components/SessionInfoCard";

const DashboardSessionDetailPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  const params = useParams();

  if (typeof window !== "undefined") {
    const questionsChannel = supabaseDefaultClient
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Question",
        },
        (payload) => {
          void Promise.all([
            apiUtils.questionSession.getQuestionsBySessionId.invalidate({
              sessionId: params.sessionId as string,
              sortBy: "popular",
            }),
            apiUtils.questionSession.getQuestionsBySessionId.invalidate({
              sessionId: params.sessionId as string,
              sortBy: "recent",
            }),
          ]);
        },
      )
      .subscribe();
  }

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
