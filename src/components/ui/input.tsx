
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Added debug log for input focus and paste events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log('Input focused', e.target.id || 'unnamed input');
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      console.log('Content pasted in input', e.target.id || 'unnamed input');
      // Let the default paste behavior continue
      if (props.onPaste) {
        props.onPaste(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onPaste={handlePaste}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
