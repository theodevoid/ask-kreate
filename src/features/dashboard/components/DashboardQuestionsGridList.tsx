import { Reorder } from "motion/react";
import { useState } from "react";
import { DashboardQuestionCard } from "./DashboardQuestionCard";

type DashboardQuestionsGridListProps = {
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
  }[];
};

export const DashboardQuestionsGridList = (
  props: DashboardQuestionsGridListProps,
) => {
  const [data, setData] = useState(props.questions);

  return (
    <Reorder.Group onReorder={setData} values={data}>
      <div className="grid grid-cols-1 gap-4">
        {props.questions.map((question) => {
          return (
            <Reorder.Item value={question.id} key={question.id} drag={false}>
              <DashboardQuestionCard
                content={question.body}
                likes={question.upvotes}
                timestamp={question.createdAt}
                userAvatar=""
                username={question.name ?? ""}
                id={question.id}
                key={question.id}
                questionSessionId={question.questionSessionId}
              />
            </Reorder.Item>
          );
        })}
      </div>
    </Reorder.Group>
  );
};
