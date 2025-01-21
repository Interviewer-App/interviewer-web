import axiosInstance from "./axioinstance";

export const getAllInterviewSchedules =async(companyId) =>{

    try {
        const response=await axiosInstance.get(`/interview/schedules/${companyId}`);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const bookSchedule =async(data) =>{

    try {
        const response=await axiosInstance.post(`/interview/book-schedule/`, data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}