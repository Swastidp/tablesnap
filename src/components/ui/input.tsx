import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "technical";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base recessed data slot styling
          "flex h-14 w-full rounded-lg border-none bg-chassis px-6 py-4 text-sm text-ink transition-all duration-150",
          // Neumorphic recessed shadow
          "shadow-neu-recessed",
          // Focus state with LED-like glow
          "focus-visible:outline-none focus-visible:shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff,0_0_0_2px_#ff4757]",
          // Placeholder styling
          "placeholder:text-ink-muted/50",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Technical variant uses monospace
          variant === "technical" && "font-mono tracking-wide",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
