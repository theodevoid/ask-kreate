import { QuestionCard } from "~/features/dashboard/components/QuestionCard";
import { Reorder } from "motion/react";
import { useState } from "react";

type QuestionsGridListProps = {
  questions: {
    id: string;
    name: string | null;
    body: string;
    createdAt: Date;
    upvotes: number;
    QuestionUpvotes?: {
      userId: string;
    }[];
    questionSessionId: string;
    isPinned: boolean;
  }[];
};

export const QuestionsGridList = (props: QuestionsGridListProps) => {
  const [data, setData] = useState(props.questions);

  return (
    <Reorder.Group onReorder={setData} values={data}>
      <div className="grid grid-cols-1 gap-4">
        {props.questions.map((question) => {
          return (
            <Reorder.Item value={question.id} key={question.id} drag={false}>
              <QuestionCard
                sessionId={question.questionSessionId}
                content={question.body}
                likes={question.upvotes}
                timestamp={question.createdAt}
                userAvatar=""
                username={question.name ?? ""}
                id={question.id}
                key={question.id}
                upvoted={!!question.QuestionUpvotes?.length}
                isPinned={question.isPinned}
              />
            </Reorder.Item>
          );
        })}
      </div>
    </Reorder.Group>
  );
};
