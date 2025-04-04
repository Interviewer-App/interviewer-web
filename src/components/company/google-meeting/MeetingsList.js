import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { api } from '@/lib/api/api';

export function MeetingsList() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get('/meetings');
        setMeetings(response.data);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);
  
  const handleCreateMeeting = () => {
    router.push('/meetings/create');
  };
  
  const handleViewMeeting = (id) => {
    router.push(`/meetings/${id}`);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Interviews</CardTitle>
        <Button onClick={handleCreateMeeting}>
          Schedule New Interview
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No interviews scheduled yet</p>
            <Button onClick={handleCreateMeeting}>Schedule Your First Interview</Button>
          </div>
        ) : (
          <div className="divide-y">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{meeting.title}</h3>
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(meeting.startTime), 'PPP')} at {format(new Date(meeting.startTime), 'p')}
                </p>
                <p className="text-sm">
                  {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewMeeting(meeting.id)}
                  >
                    View Details
                  </Button>
                  {meeting.meetingLink && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(meeting.meetingLink, '_blank')}
                    >
                      Join Meeting
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}