import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles - Industrial tactile button
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-150 ease-mechanical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-chassis disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Safety Orange with neumorphic accent shadows
        default:
          "bg-accent text-accent-foreground shadow-neu-accent border border-white/20 hover:bg-accent-hover hover:brightness-110 active:translate-y-[2px] active:shadow-neu-pressed",
        // Destructive - Error state
        destructive:
          "bg-error text-white shadow-neu-button hover:brightness-110 active:translate-y-[2px] active:shadow-neu-pressed",
        // Outline - Chassis surface with border
        outline:
          "border-2 border-shadow-deep bg-chassis shadow-neu-button text-ink hover:bg-panel hover:text-accent active:translate-y-[2px] active:shadow-neu-pressed",
        // Secondary - Raised panel
        secondary:
          "bg-chassis text-ink shadow-neu-button hover:bg-panel hover:text-accent active:translate-y-[2px] active:shadow-neu-pressed",
        // Ghost - Flat until interaction
        ghost: 
          "text-ink-muted hover:bg-muted hover:text-ink hover:shadow-neu-recessed active:shadow-neu-pressed",
        // Link - Text only
        link: "text-accent underline-offset-4 hover:underline hover:text-accent-hover",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
