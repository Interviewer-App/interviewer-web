import axiosInstance from "./axioinstance";

const fetchSendInterviewInvitations = async (
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
      console.log(response); // Ensure you're logging the correct structure
  
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


  export {
    fetchSendInterviewInvitations
  };