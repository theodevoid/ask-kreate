import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const inputVariants = cva(
  "flex w-full border border-input bg-transparent pb-1 text-sm placeholder:font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        nude: "border-0 border-b font-semibold focus-visible:border-primary rounded-none",
        outline: "border rounded focus-visible:border-primary py-1 px-2",
      },
      inputSize: {
        default: "text-base",
        large: "text-xl",
      },
    },
    defaultVariants: {
      variant: "nude",
      inputSize: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className, inputSize }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
