import axiosInstance from "./axioinstance";

export const fetchUsers = async (page, limit, setLoading, setUsers, setTotalUsers) => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(`/users/${page}/${limit}`);
    console.log(response); // Ensure you're logging the correct structure

    if (!response || !response.data || !response.data.data) {
      throw new Error(`Error fetching users: No data found`);
    }

    const data = response.data.data; // Access the user data here
    const totalUsers = response.data.total; // Access the total users count
    if (data && data.length > 0) {
      setUsers(data);
      setTotalUsers(totalUsers);
    } else {
      console.log("No users found.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/users/candidate/details/${candidateId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching candidate details:", error);
    throw error;
  }
};

export const updateCandidateById = async (candidateId, data) => {
  try {
    const response = await axiosInstance.patch(
      `/users/candidate/details/${candidateId}`, data
    );
    return response;
  } catch (error) {
    console.log("Error updatinging candidate details:", error);
    throw error;
  }
};

export const getCompanyById = async (companyId) => {
  try {
    const response = await axiosInstance.get(
      `/users/company/details/${companyId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching company details:", error);
    throw error;
  }
};

export const updateCompanyById = async (companyId, data) => {
  try {
    const response = await axiosInstance.patch(
      `/users/company/details/${companyId}`, data
    );
    return response;
  } catch (error) {
    console.log("Error updatinging company details:", error);
    throw error;
  }
};

export const submitSurvey = async (answers) => {
  try {
    const response = await axiosInstance.post(
      `/users/user/servey/`, answers
    );
    return response;
  } catch (error) {
    console.log("Error saving survey answers:", error);
    throw error;
  }
};

export const deleteUserByEmail = async (email) => {
  try {
    const response = await axiosInstance.delete(
      `/users/email/${email}`, 
    );
    return response;
  } catch (error) {
    console.log("Error deleting user account:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      `/auth/forgot-password/`, email 
    );
    return response;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

export const uploadDocumet = async (formdata, candidateId) => {
  try {
    const response = await axiosInstance.post(
      `/upload/cv/${candidateId}`, formdata 
    );
    return response;
  } catch (error) {
    console.log("Error uploading document:", error);
    throw error;
  }
};

export const fetchDocumet = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/upload/resume-url/${candidateId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching document:", error);
    throw error;
  }
};


export const generatePdfPage = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/ai/generate`, data
    );
    return response;
  } catch (error) {
    console.log("Error fetching document:", error);
    throw error;
  }
};



export const deleteUser = async (userId) => {
  try {
      const response = await axiosInstance.delete(`/users/${userId}`)
      return response;
  } catch (error) {
      console.log(error);
      throw error;  
  }
}