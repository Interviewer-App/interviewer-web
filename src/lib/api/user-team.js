import axiosInstance from "./axioinstance";

export const getCompanyTeams = async (companyId, page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/users/company/team/${page}/${limit}/${companyId}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTeam = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/users/register/team/member/`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error creating team:", error);
    throw error;
  }
};
