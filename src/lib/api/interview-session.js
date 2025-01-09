import axiosInstance from './axioinstance';

const fetchJoinedInterviews = async (candidateId, page = 1, limit = 10, setLoading, setLimit, setPayments) => {
    try {
        setLoading(true); // Start loading indicator
        const response = await axiosInstance.get(`/interview-session/candidate/${candidateId}/${page}/${limit}`);
        const data = response.data;

        console.log('API response:', data);  // Log API response for debugging

        setPayments(data); // Set the state with the fetched data
        setLoading(false); // End loading indicator

    } catch (error) {
        console.error('Error fetching interviews:', error);
        setPayments([]); // Handle error by resetting payments to empty array
        setLoading(false); // End loading indicator
    }
};

export { fetchJoinedInterviews };
