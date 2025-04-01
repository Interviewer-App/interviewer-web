"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    MoreHorizontal,
    Plus,
    Users,
    CalendarRange,
    CalendarDays,
    Edit,
    UserPlus,
    CalendarCheck,
    Trash2,
} from "lucide-react"
import {
    format,
    isToday,
    isTomorrow,
    isYesterday,
    addDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
} from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";// Types
import { createSchedulesForInterviews } from "@/lib/api/interview"

// Add this interface at the top of the file, after the TimeSlot interface


export default function TimeSlotsTab({ interviewId, interviewTimeSlotsTabel }) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [dateRange, setDateRange] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [duration, setDuration] = useState("60");
    const [schedules, setSchedules] = useState([]);
    const { toast } = useToast();

    // Calendar and scheduling states
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [calendarView, setCalendarView] = useState("month")
    const [showAddSlotDialog, setShowAddSlotDialog] = useState(false)
    const [isAddTimeSlotDialogOpen, setIsAddTimeSlotDialogOpen] = useState(false)
    const [newSlot, setNewSlot] = useState({
        date: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        startAmPm: "AM",
        endAmPm: "AM",
    })

    // Add this state after the other state declarations
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    // Sample time slots - in a real app, this would come from an API
    // Replace the existing timeSlots state with this enhanced version that includes more details
    const [timeSlots, setTimeSlots] = useState(interviewTimeSlotsTabel)

    // Simulate loading data
    useEffect(() => {
        setIsLoading(true)
        // Simulate API call
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    // Group time slots by date
    const groupedTimeSlots = timeSlots.reduce(
        (acc, slot) => {
            const dateStr = format(slot.date, "yyyy-MM-dd")
            if (!acc[dateStr]) {
                acc[dateStr] = []
            }
            acc[dateStr].push(slot)
            return acc
        },
        {},
    )

    // Sort dates for display
    const sortedDates = Object.keys(groupedTimeSlots).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime()
    })

    // Handle adding a new time slot
    const handleAddTimeSlot = () => {
        const id = `TS${timeSlots.length + 1}`.padStart(5, "0")
        const startTimeWithAmPm = `${newSlot.startTime} ${newSlot.startAmPm}`
        const endTimeWithAmPm = `${newSlot.endTime} ${newSlot.endAmPm}`

        const newTimeSlot = {
            id,
            date: newSlot.date,
            startTime: startTimeWithAmPm,
            endTime: endTimeWithAmPm,
            isBooked: false,
            location: "",
            description: "",
        }

        setTimeSlots([...timeSlots, newTimeSlot])
        setShowAddSlotDialog(false)
        toast.success("New time slot added successfully")
    }

    // Get time slots for selected date
    const getTimeSlotsForDate = (date) => {
        if (!date) return []

        const dateStr = format(date, "yyyy-MM-dd")
        return groupedTimeSlots[dateStr] || []
    }

    const addSchedule = () => {
        if (!dateRange || !startTime || !endTime) {
            toast.error("Please fill all schedule fields");
            return;
        }

        const newSchedule = {
            id: Date.now().toString(),
            date: dateRange,
            startTime,
            endTime,
        };

        setSchedules([...schedules, newSchedule]);
    };

    const removeSchedule = (id) => {
        setSchedules(schedules.filter((sch) => sch.id !== id));
    };

    const saveSchedules = async () => {
        if (schedules.length === 0) {
            toast.error("Please add at least one schedule");
            return;
        }

        // Validate that schedules exist
        if (schedules.length === 0) {
            toast.error("Please add at least one schedule");
            return;
        }


        try {
            const scheduleData = schedules.map((sch) => ({
                startTime: new Date(`${sch.date}T${sch.startTime}`).toISOString(),
                endTime: new Date(`${sch.date}T${sch.endTime}`).toISOString(),
            }));
        
            const response = await createSchedulesForInterviews(interviewId,scheduleData)
            if (response) {
                toast({
                    title: "Success!",
                    description: "Schedules saved successfully",
                  });
                
                setIsAddTimeSlotDialogOpen(false) 
                setSchedules([]) 
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error saving schedules",
                  });
            }
            
        } catch (error) {
            console.error("Error saving schedules:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error saving schedules",
              });
        }

    }

    // Get sessions for calendar view
    const getSessionsForCalendarView = () => {
        if (!selectedDate) return []

        let range

        if (calendarView === "month") {
            const start = startOfMonth(selectedDate)
            const end = endOfMonth(selectedDate)
            range = eachDayOfInterval({ start, end })
        } else if (calendarView === "week") {
            const start = startOfWeek(selectedDate)
            const end = endOfWeek(selectedDate)
            range = eachDayOfInterval({ start, end })
        } else {
            range = [selectedDate]
        }

        return range.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd")
            const slots = groupedTimeSlots[dateStr] || []

            return {
                date,
                slots,
                isCurrentMonth: isSameMonth(date, selectedDate),
            }
        })
    }

    // Format date for display
    const formatDate = (date) => {
        if (isToday(date)) return `Today, ${format(date, "MMM d")}`
        if (isTomorrow(date)) return `Tomorrow, ${format(date, "MMM d")}`
        if (isYesterday(date)) return `Yesterday, ${format(date, "MMM d")}`
        return format(date, "EEE, MMM d, yyyy")
    }

    // Add this function to handle opening the details dialog
    const handleViewDetails = (slot) => {
        setSelectedTimeSlot(slot)
        setShowDetailsDialog(true)
    }

    return (
        <div className="space-y-6">
            {/* Interview Schedule Section */}

            {/* All Scheduled Time Slots */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 dark:text-blue-500" />
                                All Scheduled Time Slots
                            </CardTitle>
                            <CardDescription>View and manage all available interview time slots</CardDescription>
                        </div>
                        <div>
                            <Dialog
                                open={isAddTimeSlotDialogOpen}
                                onOpenChange={setIsAddTimeSlotDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Add Schedule
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Schedule</DialogTitle>
                                        <DialogDescription>
                                            Create a new schedule for the interview.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">

                                        <div className="grid grid-cols-1 md:grid-cols-1 ">
                                            <div>
                                                {/* <FormLabel>Date</FormLabel> */}
                                                <div className="relative">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start !bg-[#0a0a0a] h-[40px] text-left font-normal",
                                                                    !dateRange && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                                {dateRange ? (
                                                                    format(new Date(dateRange), "PPP") // e.g., "Mar 26, 2025"
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    dateRange
                                                                        ? new Date(dateRange)
                                                                        : undefined
                                                                }
                                                                onSelect={(selectedDate) => {
                                                                    if (selectedDate) {
                                                                        setDateRange(
                                                                            format(selectedDate, "yyyy-MM-dd")
                                                                        );
                                                                    } else {
                                                                        setDateRange(""); // Clear the date if the user deselects
                                                                    }
                                                                }}
                                                                initialFocus
                                                                disabled={(date) =>
                                                                    date < new Date().setHours(0, 0, 0, 0)
                                                                } // Disable past dates
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            <div>
                                                {/* <FormLabel>Interview Duration (mins)</FormLabel> */}
                                                <Input
                                                    type="number"
                                                    placeholder="Duration in minutes"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    min="15"
                                                    step="15"
                                                />
                                            </div>


                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                {/* <FormLabel>Start Time</FormLabel> */}
                                                <Input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                {/* <FormLabel>End Time</FormLabel> */}
                                                <Input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={addSchedule}
                                                className="flex items-center w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add to Schedule
                                            </Button>
                                        </div>
                                    </div>



                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4" />
                                            <span> Your Schedules</span>
                                        </h3>
                                        {schedules.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No schedules added yet
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {schedules.map((sch, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-secondary/20 rounded-md"
                                                    >
                                                        <div className="grid grid-cols-3 gap-4 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                                <span>{sch.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <span>{sch.startTime}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <span>{sch.endTime}</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeSchedule(sch.id)}
                                                            className="ml-2 h-6 w-6 p-0 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <DialogFooter className="mt-6">
                                        <Button variant="outline" onClick={() => setIsAddTimeSlotDialogOpen(false)}>
                                            Close
                                        </Button>

                                        <Button onClick={saveSchedules}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {sortedDates.length > 0 ? (
                            <div className="rounded-md dark:border dark:border-[#4d4d4d] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm ">
                                        <thead>
                                            <tr className="dark:bg-muted/50">
                                                <th className="h-10 px-4 text-left font-medium">Date & Time</th>
                                                <th className="h-10 px-4 text-left font-medium">Status</th>
                                                <th className="h-10 px-4 text-left font-medium">Name</th>
                                                <th className="h-10 px-4 text-left font-medium">Email</th>
                                                <th className="h-10 px-4 text-right font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timeSlots
                                                .map((slot) => (
                                                    <tr key={slot.id} className="border-t dark:border-[#4d4d4d] dark:hover:bg-muted/30 dark:transition-colors">
                                                        <td className="p-4">
                                                            <div className="font-medium">{formatDate(slot.date)}</div>
                                                            <div className="dark:text-muted-foreground flex items-center gap-1 mt-1">
                                                                <Clock className="h-3 w-3" />
                                                                {slot.startTime} - {slot.endTime}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge className={slot.isBooked ? "dark:bg-amber-500" : "dark:bg-green-500"}>
                                                                {slot.isBooked ? "Booked" : "Available"}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">{slot.candidateDetails?.name || "-"}</td>
                                                        <td className="p-4">{slot.candidateDetails?.email || "-"}</td>
                                                        {/* <td className="p-4 max-w-[200px]">
                              <div className="truncate">{slot.description || "-"}</div>
                            </td> */}
                                                        {/* <td className="p-4">
                              {slot.isBooked && slot.bookedBy ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs dark:bg-amber-100 dark:text-amber-700">
                                      {slot.bookedBy.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="truncate max-w-[120px]">{slot.bookedBy.name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td> */}
                                                        <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {slot.isBooked ? (
                                                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(slot)}>
                                                                        <Eye className="h-3.5 w-3.5 mr-1" />
                                                                        Details
                                                                    </Button>
                                                                ) : (
                                                                    <></>
                                                                    //   <Button size="sm" className="dark:bg-blue-600 dark:hover:bg-blue-700">
                                                                    //     <Plus className="h-3.5 w-3.5 mr-1" />
                                                                    //     Book
                                                                    //   </Button>
                                                                )}
                                                                {/* <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {slot.isBooked ? (
                                      <DropdownMenuItem onClick={() => handleViewDetails(slot)}>
                                        View Details
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem>Book Slot</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>Edit Slot</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500">Delete Slot</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu> */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-md">
                                <p className="text-muted-foreground mb-4">No time slots have been scheduled yet</p>
                                <Button onClick={() => setShowAddSlotDialog(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Time Slot
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Time Slot Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Time Slot Details</DialogTitle>
                        <DialogDescription>Detailed information about the selected time slot.</DialogDescription>
                    </DialogHeader>

                    {selectedTimeSlot && (
                        <div className="space-y-6 py-4">
                            {/* Time and Date */}
                            <div className="dark:bg-black-900 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="dark:bg-blue-100 p-2 rounded-full">
                                        <Clock className="h-5 w-5 dark:text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                                        </h3>
                                        <p className="text-muted-foreground">{format(selectedTimeSlot.date, "EEEE, MMMM d, yyyy")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        className={
                                            selectedTimeSlot.status === "completed"
                                                ? "dark:bg-green-500"
                                                : selectedTimeSlot.status === "cancelled"
                                                    ? "dark:bg-red-500"
                                                    : selectedTimeSlot.status === "no-show"
                                                        ? "dark:bg-gray-500"
                                                        : "dark:bg-amber-500"
                                        }
                                    >
                                        {selectedTimeSlot.status
                                            ? selectedTimeSlot.status.charAt(0).toUpperCase() + selectedTimeSlot.status.slice(1)
                                            : "Scheduled"}
                                    </Badge>
                                    {selectedTimeSlot.location && (
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {selectedTimeSlot.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {selectedTimeSlot.description && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                    <p>{selectedTimeSlot.description}</p>
                                </div>
                            )}

                            {/* Candidate Details */}
                            {selectedTimeSlot.isBooked && selectedTimeSlot.bookedBy && (
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <h4 className="font-medium">Candidate Information</h4>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-amber-100 text-amber-700">
                                                {selectedTimeSlot.bookedBy.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedTimeSlot.bookedBy.name}</p>
                                            {selectedTimeSlot.candidateDetails?.position && (
                                                <p className="text-sm text-muted-foreground">{selectedTimeSlot.candidateDetails.position}</p>
                                            )}
                                        </div>
                                    </div>

                                    {selectedTimeSlot.candidateDetails && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            {selectedTimeSlot.candidateDetails.email && (
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-muted-foreground"
                                                    >
                                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                    </svg>
                                                    <span className="text-sm">{selectedTimeSlot.candidateDetails.email}</span>
                                                </div>
                                            )}

                                            {selectedTimeSlot.candidateDetails.phone && (
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-muted-foreground"
                                                    >
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                    </svg>
                                                    <span className="text-sm">{selectedTimeSlot.candidateDetails.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Interviewer Details */}
                            {selectedTimeSlot.interviewerDetails && (
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <h4 className="font-medium">Interviewer Information</h4>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {selectedTimeSlot.interviewerDetails.name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("") || "IN"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedTimeSlot.interviewerDetails.name}</p>
                                            {selectedTimeSlot.interviewerDetails.department && (
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedTimeSlot.interviewerDetails.department}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {selectedTimeSlot.interviewerDetails.email && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-muted-foreground"
                                            >
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                            <span className="text-sm">{selectedTimeSlot.interviewerDetails.email}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            {selectedTimeSlot.notes && (
                                <div className="space-y-2">
                                    <div className="border-b pb-2">
                                        <h4 className="font-medium">Notes</h4>
                                    </div>
                                    <p className="text-sm whitespace-pre-line">{selectedTimeSlot.notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Close
                        </Button>
                        {selectedTimeSlot?.isBooked && (
                            <div className="flex gap-2">
                                {/* <Button variant="outline" className="gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Export
                </Button> */}
                                {/* <Button className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button> */}
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
