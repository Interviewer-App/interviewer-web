import axiosInstance from "./axioinstance";

// api function to fetch joined interviews
const fetchJoinedInterviews = async (candidateId, page, limit, setLoading, setPayments, setTotalUsers) => {
  setLoading(true); // Start loading
  try {
      const response = await axiosInstance.get(`/interview-session/candidate/${candidateId}/${page}/${limit}`);
      console.log(response); // Ensure you're logging the correct structure

      if (!response || !response.data || !response.data.interviewSessions) {
          throw new Error(`Error fetching interviews: No data found`);
      }

      const data = response.data.interviewSessions; // Access the user data here
      const totalUsers = response.data.total; // Access the total users count
      if (data && data.length > 0) {
          setPayments(data);  // Update state for payments (interviews data)
          setTotalUsers(totalUsers); // Update total users
      } else {
          console.log("No interviews found.");
      }
  } catch (error) {
      console.log("Error fetching interviews:", error);
  } finally {
      setLoading(false); 
  }
};


const fetchInterviewSessionsForInterview = async (
  interviewId,
  page,
  limit,
  setLoading,
  setInterviewSessions,
  setTotalSessions
) => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(
      `/interview-session/${interviewId}/${page}/${limit}`
    );

    if (!response || !response.data) {
      throw new Error(`Error fetching users: No data found`);
    }

    const data = response.data.interviewSessions;
    const totalsessions = response.data.total;
    if (data.length > 0) {
      setInterviewSessions(data);
      setTotalSessions(totalsessions);
    } else {
      console.log("No sessions found.");
    }
  } catch (error) {
    console.log("Error fetching sessions:", error);
  } finally {
    setLoading(false);
  }
};

const getInterviewSessionById = async (sessionId) => {
  try{
      const response = await axiosInstance.get(`/interview-session/session/${sessionId}`);
      return response;
  } catch(error){
      console.log('Error fetching session:', error);
      throw error;
  }
}

export { fetchJoinedInterviews, fetchInterviewSessionsForInterview, getInterviewSessionById };