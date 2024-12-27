import { formatDistance } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";

type QuestionCardProps = {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
};

export const QuestionCard = (props: QuestionCardProps) => {
  const formatDate = (date: Date) =>
    formatDistance(props.timestamp, new Date(), { addSuffix: true });

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
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">{props.likes}</span>
        </div>
      </CardContent>
    </Card>
  );
};
