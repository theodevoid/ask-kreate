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

const SessionDetailPage: NextPageWithLayout = () => {
  return (
    <div>
      <div className="mb-8 flex flex-col">
        <h3 className="mb-6 text-3xl font-bold">Session Details</h3>
        <SessionInfoCard
          code="1234ABCDE"
          title="React: Components"
          startDate={new Date()}
          endDate={new Date()}
          isActive
        />
      </div>

      <div>
        <h4 className="mb-4 text-2xl font-semibold">Questions</h4>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {mockQuestions.map((question) => (
            <QuestionCard {...question} key={question.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

SessionDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SessionDetailPage;
