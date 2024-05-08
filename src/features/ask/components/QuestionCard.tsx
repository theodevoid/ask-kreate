import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
// import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { ThumbsUp, ExternalLink } from "lucide-react";
import { toAbbreviatedNumber } from "~/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

type QuestionCardProps = {
  avatarUrl?: string;
  username: string;
  createdAt: Date;
  body: string;
  upvotes?: number;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  avatarUrl,
  body,
  createdAt,
  username,
  upvotes = undefined,
}) => {
  return (
    <div className="flex items-start gap-2 rounded-md border-2 bg-card p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="font-bold">
            {username} &#x2022;{" "}
            <span className="text-sm text-muted-foreground">
              {formatDistance(createdAt, new Date(), {
                addSuffix: true,
              })}
            </span>
          </p>

          {/* TODO: More actions */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="h-6 w-6 rounded-full bg-transparent p-1 transition-colors hover:bg-background" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>test</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <p>{body}</p>

        <div className="mt-1 flex gap-2">
          <Link
            href="#"
            className="flex items-center gap-1 text-primary underline"
          >
            View Answer <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {typeof upvotes === "number" && (
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="ghost" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-base">{toAbbreviatedNumber(upvotes)}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
