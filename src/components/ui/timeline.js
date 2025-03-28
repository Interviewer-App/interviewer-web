import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const Timeline = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("group relative pb-8 pl-8 sm:pl-44", className)}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"

const TimelineHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-1 flex flex-col items-start before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-slate-300 before:px-px after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-4 after:border-primary-foreground/95 after:bg-foreground group-last:before:hidden sm:flex-row sm:before:left-0 sm:before:ml-[10rem] sm:after:left-0 sm:after:ml-[10rem]",
      className
    )}
    {...props}
  />
))
TimelineHeader.displayName = "TimelineHeader"

const TimelineTitle = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-xl font-medium text-primary", className)}
      {...props}
    >
      {children}
    </div>
  )
)
TimelineTitle.displayName = "TimelineTitle"

const TimelineTime = ({timeBgColor, className, variant = "default", ...props }) => {
  return (
    <div
      className={cn(
        "left-0 mb-3 inline-flex flex-col items-center justify-center text-sm font-semibold uppercase sm:absolute sm:mb-0 bg-[#18181E] px-4 rounded-xl aspect-square",
        className
      )}
      {...props}
    >
      <div className="px-2 py-6 bg-[#25252F] rounded-xl aspect-square relative h-[100px]">
        <div className= {` ${timeBgColor} absolute h-[12px] aspect-square top-2 right-2 rounded-full`}>
          
        </div>
        <div className="text-xl font-semibold text-white">{props.date}</div>

        <div className="text-sm  text-white">{props.time}</div>

      </div>
    </div>
  );
};
TimelineTime.displayName = "TimelineTime";


const TimelineDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
TimelineDescription.displayName = "TimelineDescription"

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTime,
  TimelineTitle,
  TimelineDescription
}
