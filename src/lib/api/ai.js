import axiosInstance from "./axioinstance";

export const generateQuestions = async (sessionId, data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-questions/${sessionId}`, data
    );
    return response;
  } catch (error) {
    console.log("Error generating questions:", error);
    throw error;
  }
};

export const analiyzeQuestion = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/analiyze-question`, data);
    return response;
  } catch (error) {
    console.log("Error analiyzing questions:", error);
    throw error;
  }
};
