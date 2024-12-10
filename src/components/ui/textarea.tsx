import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md font-semibold placeholder:font-medium border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      textareaSize: {
        default: "text-base",
        large: "text-xl",
      },
    },
    defaultVariants: {
      textareaSize: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaSize, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ className, textareaSize }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
