import axiosInstance from "./axioinstance";

export const getCompanyTeams = async (page, limit, companyId, setTeams, setTotalTeams) => {
    try {
      const response = await axiosInstance.get(`/users/company/team/${page}/${limit}/${companyId}`);
  
      if (!response || !response.data || !response.data.data) {
        throw new Error(`Error fetching teams: No data found`);
      }
  
      const data = response.data.team; 
      const totalTeams = response.data.total;
      if (data && data.length > 0) {
        setTeams(data);
        setTotalTeams(totalTeams);
      } else {
        console.log("No teams found.");
      }
    } catch (error) {
      console.log("Error fetching teams:", error);
    } 
  };

  export const createTeam = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/users/register/team/member/`, data
      );
      return response;
    } catch (error) {
      console.log("Error creating team:", error);
      throw error;
    }
  };