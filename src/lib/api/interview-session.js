import axiosInstance from "./axioinstance";

// api function to fetch joined interviews
const fetchJoinedInterviews = async (candidateId, page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/interview-session/candidate/${candidateId}/${page}/${limit}`
    );
    
    if (response && response.data) {
      const data=response.data;
      console.log(data)
        // Assuming the data contains the interviews and total count
    }
    return { interviews: [], total: 0 };  // Default if no data is found
  } catch (error) {
    console.error('Error fetching joined interviews:', error);
    return { interviews: [], total: 0 };  // In case of error, return empty
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