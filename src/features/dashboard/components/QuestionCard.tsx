import { formatDistance } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/utils/api";

type QuestionCardProps = {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  upvoted?: boolean;
  sessionId: string;
};

export const QuestionCard = (props: QuestionCardProps) => {
  const apiUtils = api.useUtils();

  const formatDate = (date: Date) =>
    formatDistance(props.timestamp, new Date(), { addSuffix: true });

  const upvoteQuestionMutation = api.questionSession.upvoteQuestion.useMutation(
    {
      onSuccess: async () => {
        await Promise.all([
          apiUtils.questionSession.getQuestionsBySessionId.invalidate({
            sessionId: props.sessionId,
            sortBy: "popular",
          }),
          apiUtils.questionSession.getQuestionsBySessionId.invalidate({
            sessionId: props.sessionId,
            sortBy: "recent",
          }),
        ]);
      },
    },
  );

  const removeUpvoteQuestionMutation =
    api.questionSession.removeUpvoteQuestion.useMutation({
      onSuccess: async () => {
        await Promise.all([
          apiUtils.questionSession.getQuestionsBySessionId.invalidate({
            sessionId: props.sessionId,
            sortBy: "popular",
          }),
          apiUtils.questionSession.getQuestionsBySessionId.invalidate({
            sessionId: props.sessionId,
            sortBy: "recent",
          }),
        ]);
      },
    });

  const toggleUpvote = () => {
    if (
      upvoteQuestionMutation.isPending ||
      removeUpvoteQuestionMutation.isPending
    )
      return;

    if (props.upvoted) {
      removeUpvoteQuestionMutation.mutate({ questionId: props.id });
    } else {
      upvoteQuestionMutation.mutate({ questionId: props.id });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={props.userAvatar} alt={props.username} />
            <AvatarFallback>{props.username.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {props.username ? props.username : "Anonymous"}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(props.timestamp)}
            </p>
            <p className="text-sm">{props.content}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <Button
            onClick={toggleUpvote}
            disabled={
              upvoteQuestionMutation.isPending ||
              removeUpvoteQuestionMutation.isPending
            }
            size="sm"
            variant={props.upvoted ? "default" : "secondary"}
          >
            <ThumbsUp className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{props.likes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
