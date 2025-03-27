"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, marks, enableColor, id, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    id={id}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className={`relative h-2 w-full grow overflow-hidden rounded-full ${enableColor && marks > 75 ? 'bg-green-600' : enableColor && marks > 50? 'bg-yellow-500' : enableColor && marks > 25 ? 'bg-orange-500' : enableColor ? 'bg-red-500' : 'bg-white' } dark:bg-neutral-800`}>
      <SliderPrimitive.Range className={`absolute h-full ${enableColor && marks > 75 ? 'bg-green-600' : enableColor && marks > 50? 'bg-yellow-500' : enableColor && marks > 25 ? 'bg-orange-500' : enableColor ? 'bg-red-500' : 'bg-white' }`} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-5 w-5 rounded-full border-2 border-neutral-900 bg-lightred ring-offset-lightred transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
