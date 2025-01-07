import axiosInstance from "./axioinstance";

export const getInterviews = async (companyId) => {
    try{
        const response = await axiosInstance.get(`/interview/${companyId}`);
        return response;
    } catch(error){
        console.log('Error fetching interviews:', error);
        throw error;
    }
}

export const createInterview = async (data) => {
    try{
        const response = await axiosInstance.post(`/interview`, data);
        return response;
    } catch(error){
        console.log('Error creating interview:', error);
        throw error;
    }
}

export const getAllInterviews = async () => {
    try{
        const response = await axiosInstance.get(`/interview`);
        return response;
    } catch(error){
        console.log('Error fetching all interviews:', error);
        throw error;
    }
}
