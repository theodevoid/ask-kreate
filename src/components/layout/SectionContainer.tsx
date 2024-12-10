import React, { forwardRef } from "react";
import { cn } from "~/lib/utils";
import GridPattern from "../magicui/grid-pattern";

type SectionContainerProps = {
  padded?: boolean;
  withGrid?: boolean;
  containerClassName?: string;
};

export const SectionContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & SectionContainerProps
>(
  (
    { className, children, padded, withGrid, containerClassName, ...props },
    ref,
  ) => {
    return (
      <div className={cn("relative h-full", containerClassName)}>
        <section
          ref={ref}
          className={cn(
            "container flex flex-col lg:max-w-screen-md",
            className,
            padded ? "px-4" : "",
          )}
          {...props}
        >
          {children}
        </section>
        {withGrid && (
          <GridPattern className="-z-10 opacity-70" width={80} height={80} />
        )}
      </div>
    );
  },
);

SectionContainer.displayName = "SectionContainer";
