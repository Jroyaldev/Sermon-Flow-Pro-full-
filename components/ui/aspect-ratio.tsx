"use client"

import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

// Assuming you have a utility function for class names
import { cn } from "@/lib/utils"

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "relative overflow-hidden",
      // Responsive width
      "w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%]",
      // Responsive padding
      "p-2 sm:p-3 md:p-4",
      // Responsive margin
      "mx-auto my-2 sm:my-3 md:my-4",
      // Rounded corners for better mobile appearance
      "rounded-lg",
      // Allow custom classes to override
      className
    )}
    {...props}
  />
))
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName

export { AspectRatio }
