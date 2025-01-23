import axiosInstance from "./axioinstance";

const fetchUsers = async (page, limit, setLoading, setUsers, setTotalUsers) => {
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

export { fetchUsers };
