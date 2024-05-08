import React from "react";
import { cn } from "~/lib/utils";

type SectionProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <div className={cn("flex h-fit w-full flex-col p-4 pb-8", className)}>
      <div className="-mt-8 mb-4 w-fit self-center rounded-md border-2 bg-accent px-4 text-center text-lg font-bold">
        {title}
      </div>

      <div>{children}</div>
    </div>
  );
};
