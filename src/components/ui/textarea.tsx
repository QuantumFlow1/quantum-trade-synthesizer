
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    // Added onPaste event handling
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      console.log('Content pasted in textarea');
      if (props.onPaste) {
        props.onPaste(e);
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onPaste={handlePaste}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
