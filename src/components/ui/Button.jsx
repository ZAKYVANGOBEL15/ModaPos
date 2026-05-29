import { cn } from "../../lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  return (
    <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "bg-transparent text-primary hover:bg-muted": variant === "ghost",
            "border border-border bg-transparent hover:bg-muted": variant === "outline",
            "bg-black text-white hover:bg-black/90": variant === "black", // new variant for black button
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
      {...props}
    />
  );
}
