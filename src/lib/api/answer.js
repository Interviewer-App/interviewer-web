import axiosInstance from "./axioinstance";

export const getInterviewSessionScoreById = async (sessionId) => {
    try{
        const response = await axiosInstance.get(`/answers/totalScore/${sessionId}`);
        return response;
    } catch(error){
        console.log('Error fetching session details:', error);
        throw error;
    }
  }