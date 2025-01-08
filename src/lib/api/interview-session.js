import axiosInstance from './axioinstance';

const fetchJoinedInterviews =async(candidateId) =>{
    try {
        const response=await axiosInstance.get(`/interview-session/candidate/${candidateId}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export {fetchJoinedInterviews};