// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils" // Assuming you use shadcn/ui's cn utility

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Wrap your Textarea component with React.forwardRef
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref} // Attach the forwarded ref to the actual textarea DOM element
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea" // Good practice for debugging in React DevTools

export { Textarea }