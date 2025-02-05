import axiosInstance from "./axioinstance";

// api function to fetch joined interviews
const fetchJoinedInterviews = async (
  candidateId,
  page,
  limit,
  setLoading,
  setPayments,
  setTotalUsers
) => {
  setLoading(true); // Start loading
  try {
    const response = await axiosInstance.get(
      `/interview-session/candidate/${candidateId}/${page}/${limit}`
    );
    // console.log(response); // Ensure you're logging the correct structure

    if (!response || !response.data || !response.data.interviewSessions) {
      throw new Error(`Error fetching interviews: No data found`);
    }

    const data = response.data.interviewSessions; // Access the user data here
    const totalUsers = response.data.total; // Access the total users count
    if (data && data.length > 0) {
      setPayments(data); // Update state for payments (interviews data)
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


const fetchCandidatesForInterview = async (
  interviewId,
  page,
  limit,
  setLoading,
  setInterviewCandidates,
  setTotalCandidates
) => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(
      `/interview/booked-candidates/${interviewId}/${page}/${limit}`
    );

    if (!response || !response.data) {
      throw new Error(`Error fetching users: No data found`);
    }

    const data = response.data.data;
    const totalsessions = response.data.total;
    if (data.length > 0) {
      setInterviewCandidates(data);
      setTotalCandidates(totalsessions);
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
  try {
    const response = await axiosInstance.get(
      `/interview-session/session/${sessionId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching session:", error);
    throw error;
  }
};

const getInterviewSessionHistoryById = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/interview-session/session-history/${sessionId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching session history:", error);
    throw error;
  }
};

export const createInterviewSession = async (data) => {
  try {
    const response = await axiosInstance.post(`/interview-session`, data);
    return response;
  } catch (error) {
    console.log("Error Create interview session:", error);
    throw error;
  }
};

export const getInterviewOverviewById = async (interviewId) => {
  try{
      const response = await axiosInstance.get(`/interview-session/overview/${interviewId}`);
      return response;
  } catch(error){
      console.log('Error fetching interview:', error);
      throw error;
  }
}


export const getCompletedSessions = async (interviewId) => {
  try{
      const response = await axiosInstance.get(`/interview-session/comparison/${interviewId}`);
      return response;
  } catch(error){
      console.log('Error fetching completed sessions:', error);
      throw error;
  }
}


export const getCompletedSessionComparision = async (data) => {
  try{
      const response = await axiosInstance.post(`/ai/candidate-comparison`,data);
      return response;
  } catch(error){
      console.log('Error fetching completed comparision:', error);
      throw error;
  }
}






export {
  fetchJoinedInterviews,
  fetchInterviewSessionsForInterview,
  getInterviewSessionById,
  getInterviewSessionHistoryById,
  fetchCandidatesForInterview
};
