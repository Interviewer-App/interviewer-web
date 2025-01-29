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

export const getPublishedInterview = async (sordBy, datePosted, interviewCategory, jobTitle, keyWords) => {
    try{
        const response = await axiosInstance.get(`/interview/published?sortBy=${sordBy}&datePosted=${datePosted}&category=${interviewCategory}&jobTitle=${jobTitle}&keyWords=${keyWords}`);
        return response;
    } catch(error){
        console.log('Error fetching published interviews:', error);
        throw error;
    }
}


export const getScheduledInterview = async (candidateid) =>{
    try {
        const response=await axiosInstance.get(`/interview/schedules/candidate/${candidateid}`);
        return response;
    } catch (error) {
        console.log('Error fetching scheduled interviews',error)
        throw error;
    }
}

export const getOverviewOfCandidateInterviews = async (candidateid) =>{
    try {
        const response=await axiosInstance.get(`/interview/schedules/candidate/overview/${candidateid}`);
        return response;
    } catch (error) {
        console.log('Error fetching overview',error)
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

export const updateInterview = async (interviewId, data) => {
    try{
        const response = await axiosInstance.patch(`/interview/${interviewId}`, data);
        return response;
    } catch(error){
        console.log('Error updating interview:', error);
        throw error;
    }
}

export const getInterviewById = async (interviewId) => {
    try{
        const response = await axiosInstance.get(`/interview/interview/${interviewId}`);
        return response;
    } catch(error){
        console.log('Error fetching interview:', error);
        throw error;
    }
}

export const deleteInterview = async (interviewID) => {
    try {
        const response=await axiosInstance.delete(`/interview/${interviewID}`)
        return response;
    } catch (error) {
        console.log(`Error Deleting Interview`,error)
        throw error;
    }
}

export const interviewStatus = async (interviewID) => {
    try {
        const response=await axiosInstance.get(`/interview/schedule-stats/${interviewID}`)
        return response;
    } catch (error) {
        console.log(`Error fetching Interview status`,error)
        throw error;
    }
}