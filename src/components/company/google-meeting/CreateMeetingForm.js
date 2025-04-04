import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { GoogleAuthButton } from './GoogleAuthButton';
import { api } from '@/lib/api/api';
import { useToast } from "@/hooks/use-toast";

export function CreateMeetingForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [startDate, setStartDate] = useState(undefined);
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(60); // in minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarPopoverOpen, setCalendarPopoverOpen] = useState(false);
  
  const handleAddAttendee = () => {
    if (attendeeEmail && !attendees.includes(attendeeEmail)) {
      setAttendees([...attendees, attendeeEmail]);
      setAttendeeEmail('');
    }
  };
  
  const handleRemoveAttendee = (email) => {
    setAttendees(attendees.filter(a => a !== email));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!startDate) {
      toast({
        title: "Missing information",
        description: "Please select a date for the meeting",
        variant: "destructive"
      });
      return;
    }
    
    if (attendees.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one attendee",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create start date time from date and time
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDateTime = new Date(startDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on duration
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);
      
      // Format in ISO string for API
      const startISO = startDateTime.toISOString();
      const endISO = endDateTime.toISOString();
      
      // Timezone from browser
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const meetingData = {
        title,
        description,
        startTime: startISO,
        endTime: endISO,
        timeZone,
        attendees
      };
      
      const response = await api.post('/meetings', meetingData);
      
      toast({
        title: "Meeting created!",
        description: "Your interview has been scheduled successfully.",
      });
      
      router.push(`/meetings/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create meeting:', error);
      toast({
        title: "Failed to create meeting",
        description: "There was an error creating your meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Schedule an Interview</CardTitle>
        <div className="flex justify-end">
          <GoogleAuthButton />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Developer Interview"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Interview for the Frontend Developer position..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover open={calendarPopoverOpen} onOpenChange={setCalendarPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {startDate ? format(startDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setCalendarPopoverOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="240"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-4">
            <Label>Attendees</Label>
            <div className="flex gap-2">
              <Input
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="email@example.com"
                type="email"
              />
              <Button 
                type="button" 
                onClick={handleAddAttendee}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            
            {attendees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attendees.map((email) => (
                  <div 
                    key={email}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(email)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Meeting...' : 'Schedule Interview'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
