import React, { forwardRef } from "react";
import { cn } from "~/lib/utils";
import { HeadMetaData } from "./HeadMetaData";

export const PageContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  return (
    <>
      <HeadMetaData />
      <main
        ref={ref}
        className={cn("container lg:max-w-screen-lg", className)}
        {...props}
      >
        {children}
      </main>
    </>
  );
});
