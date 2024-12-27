import { formatDistance } from "date-fns";
import { Check, Pin, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

type DashboardQuestionCardProps = {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  questionSessionId: string;
  isPinned: boolean;
};

export const DashboardQuestionCard = (props: DashboardQuestionCardProps) => {
  const apiUtils = api.useUtils();

  const invalidateGetQuestionQueries = async () => {
    await Promise.all([
      apiUtils.questionSession.getQuestionsBySessionId.invalidate({
        sessionId: props.questionSessionId,
        sortBy: "popular",
      }),
      apiUtils.questionSession.getQuestionsBySessionId.invalidate({
        sessionId: props.questionSessionId,
        sortBy: "recent",
      }),
    ]);
  };

  const archiveQuestionMutation =
    api.questionSession.archiveQuestion.useMutation({
      onSuccess: async () => {
        await invalidateGetQuestionQueries();
      },
    });

  const pinQuestionMutation = api.questionSession.pinQuestion.useMutation({
    onSuccess: async () => {
      await invalidateGetQuestionQueries();
    },
  });

  const handleArchiveQuestion = () => {
    archiveQuestionMutation.mutate({
      questionId: props.id,
    });
  };

  const handlePinQuestion = () => {
    pinQuestionMutation.mutate({
      questionId: props.id,
    });
  };

  return (
    <Card className={cn(props.isPinned && "border-2 border-primary")}>
      <CardContent className="pt-6">
        {props.isPinned && <Badge className="mb-4">Pinned</Badge>}
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
              {formatDistance(props.timestamp, new Date(), { addSuffix: true })}
            </p>
            <p className="text-sm">{props.content}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handlePinQuestion}
                    disabled={pinQuestionMutation.isPending || props.isPinned}
                    size="icon"
                    variant="secondary"
                  >
                    <Pin />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Pin Question</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleArchiveQuestion}
                    disabled={archiveQuestionMutation.isPending}
                    size="icon"
                    variant="secondary"
                  >
                    <Check />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Mark as answered</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center">
            <ThumbsUp className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{props.likes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
