import * as React from "react";
import { cn } from "@/lib/utils";

// Corner screws component for manufacturing detail
const CornerScrews = () => (
  <div 
    className="absolute inset-0 pointer-events-none rounded-lg"
    style={{
      backgroundImage: `
        radial-gradient(circle at 12px 12px, rgba(0,0,0,0.12) 2px, transparent 3px),
        radial-gradient(circle at calc(100% - 12px) 12px, rgba(0,0,0,0.12) 2px, transparent 3px),
        radial-gradient(circle at 12px calc(100% - 12px), rgba(0,0,0,0.12) 2px, transparent 3px),
        radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), rgba(0,0,0,0.12) 2px, transparent 3px)
      `
    }}
  />
);

// Vent slots component
const VentSlots = ({ className }: { className?: string }) => (
  <div className={cn("flex gap-1", className)}>
    <div className="h-6 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]" />
    <div className="h-6 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]" />
    <div className="h-6 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]" />
  </div>
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  showScrews?: boolean;
  showVents?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, showScrews = true, showVents = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg bg-chassis transition-all duration-300 ease-mechanical",
        elevated ? "shadow-neu-floating hover:-translate-y-1" : "shadow-neu-card hover:shadow-neu-floating hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {showScrews && <CornerScrews />}
      {showVents && <VentSlots className="absolute top-3 right-4" />}
      {children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-ink text-embossed",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-ink-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CornerScrews, VentSlots };
