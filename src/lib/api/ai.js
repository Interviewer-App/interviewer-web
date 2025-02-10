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

export const generateInterviewQuestions = async (interviewId, data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-questions-interview/${interviewId}`, data
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

export const generateInterviewJobDescription = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-description`, data);
    return response;
  } catch (error) {
    console.log("Error analiyzing questions:", error);
    throw error;
  }
};

export const generateInterviewSchedules = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-schedules`, data);
    return response;
  } catch (error) {
    console.log("Error generate schedules:", error);
    throw error;
  }
};

export const generateInterviewDuration = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-interview-duration`, data);
    return response;
  } catch (error) {
    console.log("Error generate duration:", error);
    throw error;
  }
};