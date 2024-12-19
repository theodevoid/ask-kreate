import { useParams } from "next/navigation";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { SessionInfoCard } from "~/features/dashboard/components/SessionInfoCard";
import { api } from "~/utils/api";

const SessionDetailPage = () => {
  const params = useParams();

  const { data } = api.questionSession.getById.useQuery(
    {
      id: params?.sessionId as string,
    },
    {
      enabled: !!params?.sessionId,
    },
  );

  return (
    <PageContainer>
      <SectionContainer className="min-h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col items-center gap-8 py-8">
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
          <Textarea
            className="resize-none border-0 bg-background p-0 text-lg"
            placeholder="Type your question"
          />

          <div className="flex gap-4">
            <Input placeholder="Your name (optional)" />
            <Button className="self-end">Send Question</Button>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default SessionDetailPage;
