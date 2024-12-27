import { QuestionCard } from "~/features/dashboard/components/QuestionCard";

type QuestionsGridListProps = {
  questions: {
    id: string;
    name: string | null;
    body: string;
    createdAt: Date;
    upvotes: number;
  }[];
};

export const QuestionsGridList = (props: QuestionsGridListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {props.questions.map((question) => {
        return (
          <QuestionCard
            content={question.body}
            likes={question.upvotes}
            timestamp={question.createdAt}
            userAvatar=""
            username={question.name ?? ""}
            id={question.id}
            key={question.id}
          />
        );
      })}
    </div>
  );
};
