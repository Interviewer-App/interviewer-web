import axiosInstance from "./axioinstance";

export const updateQuestion = async (questionId, data) => {
    try{
        const response = await axiosInstance.patch(`/interview-session/question/${questionId}`, data);
        return response;
    } catch(error){
        console.log('Error updating question:', error);
        throw error;
    }
}

export const updateInterviewQuestion = async (questionId, data) => {
    try{
        const response = await axiosInstance.patch(`/interview/question/${questionId}`, data);
        return response;
    } catch(error){
        console.log('Error updating question:', error);
        throw error;
    }
}

export const createQuestion = async (data) => {
    try{
        const response = await axiosInstance.post(`/interview-session/question/`, data);
        return response;
    } catch(error){
        console.log('Error creating question:', error);
        throw error;
    }
}

export const deleteQuestion = async (questionId) => {
    try{
        const response = await axiosInstance.delete(`/interview-session/question/${questionId}`);
        return response;
    } catch(error){
        console.log('Error deleting question:', error);
        throw error;
    }
}

export const deleteInterviewQuestion = async (questionId) => {
    try{
        const response = await axiosInstance.delete(`/interview/question/${questionId}`);
        return response;
    } catch(error){
        console.log('Error deleting question:', error);
        throw error;
    }
}

export const importQuestions = async (sessionId) => {
    try{
        const response = await axiosInstance.get(`/interview-session/import-questions/${sessionId}`);
        return response;
    } catch(error){
        console.log('Error importing question:', error);
        throw error;
    }
}