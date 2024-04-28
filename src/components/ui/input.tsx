import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftAddon?: React.ReactElement;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftAddon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "has-[:focus-visible]:neu-pressed neu neu-active neu-focus placeholder:text-muted-foreground flex h-11 w-full items-center rounded-md bg-transparent px-3 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {leftAddon && <div className="border-r-2 pr-2">{leftAddon}</div>}
        <input
          className={cn(
            "h-full w-full bg-transparent text-lg outline-none",
            leftAddon && "ml-3",
          )}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
