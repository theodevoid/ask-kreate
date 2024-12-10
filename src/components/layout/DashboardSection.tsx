import { type PropsWithChildren } from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "~/lib/utils";

type DashboardSectionProps = {
  title?: string;
  className?: string;
} & PropsWithChildren;

export const DashboardSection = (props: DashboardSectionProps) => {
  return (
    <section>
      {!!props.title && (
        <div className="mb-2">
          <h3 className="text-lg font-bold">{props.title}</h3>
        </div>
      )}
      <Card>
        <CardContent className={cn("!p-0", props.className)}>
          {props.children}
        </CardContent>
      </Card>
    </section>
  );
};

type DashboardGridLayoutProps = {
  className?: string;
  borderBottom?: boolean;
} & PropsWithChildren;

export const DashboardSectionContent = (props: DashboardGridLayoutProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-6 gap-x-4 p-6",
        props.borderBottom && "border-b pb-6",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
