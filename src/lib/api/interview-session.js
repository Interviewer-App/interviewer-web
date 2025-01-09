import axiosInstance from "./axioinstance";

const fetchJoinedInterviews = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/interview-session/candidate/${candidateId}`
    );
    return response;
  } catch (error) {
    console.log(error);
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
    console.error("Error fetching sessions:", error);
  } finally {
    setLoading(false);
  }
};

export { fetchJoinedInterviews, fetchInterviewSessionsForInterview };