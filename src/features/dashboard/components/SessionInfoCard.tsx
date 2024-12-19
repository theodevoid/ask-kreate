import { format } from "date-fns";
import { Calendar, Hash, MessageCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type SessionInfoCardProps = {
  title: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  code: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export const SessionInfoCard = (props: SessionInfoCardProps) => {
  const formatDate = (date: Date) => format(date, "MMM dd yyyy");

  return (
    <Card className={props.className}>
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 pb-2",
          props.headerClassName,
        )}
      >
        <CardTitle className="text-2xl font-bold">{props.title}</CardTitle>
        <Badge variant={props.isActive ? "default" : "secondary"}>
          {props.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent className={props.contentClassName}>
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">
              {formatDate(props.startDate)} - {formatDate(props.endDate)}
            </span>
          </div>

          <div className="flex items-center">
            <Hash className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">{props.code}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
