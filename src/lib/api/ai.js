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

export const generateSoftSkills = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-softskills`, data);
    return response;
  } catch (error) {
    console.log("Error generate soft skills:", error);
    throw error;
  }
};

export const generateRecommondations = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-recommendation`, data);
    return response;
  } catch (error) {
    console.log("Error generate recommondations:", error);
    throw error;
  }
};

export const generateTechnicalSkills = async (data) => {
  try {
    const response = await axiosInstance.post(`/ai/generate-technicalskills`, data);
    return response;
  } catch (error) {
    console.log("Error generate technical skills:", error);
    throw error;
  }
};

