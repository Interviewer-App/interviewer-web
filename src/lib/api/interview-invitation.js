import axiosInstance from "./axioinstance";

const fetchSendInterviewInvitations = async (
  interviewId,
  page,
  limit,
  setLoading,
  setInvitations,
  setTotalInvitations
) => {
  setLoading(true); // Start loading
  try {
    const response = await axiosInstance.get(
      `/interview/invitations/${interviewId}/${page}/${limit}`
    );
    if (!response || !response.data || !response.data.invitations) {
      throw new Error(`Error fetching interviews: No data found`);
    }

    const data = response.data.invitations; // Access the user data here
    const totalInvitations = response.data.total; // Access the total users count
    if (data && data.length > 0) {
      setInvitations(data); // Update state for payments (interviews data)
      setTotalInvitations(totalInvitations); // Update total users
    } else {
      console.log("No interviews found.");
    }
  } catch (error) {
    console.log("Error fetching interviews:", error);
  } finally {
    setLoading(false);
  }
};

export const getInterviewTimeSlotsInterviewById = async (interviewId) => {
  try {
    const response = await axiosInstance.get(`/interview/schedules/${interviewId}`);
    return response;
  } catch (error) {
    console.log('Error fetching category:', error);
    throw error;
  }
}

export const sendInvitaionForCandidates = async (data) => {
  try{
      const response = await axiosInstance.post(`/interview/send-invitation`, data);
      return response;
  } catch(error){
      console.log('Error creating question:', error);
      throw error;
  }
}


export {
  fetchSendInterviewInvitations,
  getInterviewTimeSlotsInterviewById
};