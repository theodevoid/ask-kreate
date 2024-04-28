import React from "react";
import { cn } from "~/lib/utils";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  withDoubleBackground?: boolean;
}

const Title = React.forwardRef<HTMLParagraphElement, TitleProps>(
  ({ className, as, withDoubleBackground = false, ...props }, ref) => {
    const Component = as || "h1";

    return (
      <div className="relative h-max w-max">
        {withDoubleBackground && (
          <div className="bg-primary absolute z-0 h-full w-full -rotate-3 border-2" />
        )}
        <Component
          ref={ref}
          className={cn(
            "border-foreground bg-accent z-10 border-[2px] px-2 text-3xl font-bold",
            // withDoubleBackground ? "rotate-2" : "-rotate-3",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Title.displayName = "Title";

export { Title };
