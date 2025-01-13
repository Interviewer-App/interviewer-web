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