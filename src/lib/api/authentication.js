import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'; // Replace with your API URL

/**
 * Registers a new user
 * @param {Object} userData - The user data to send to the API
 * @param {string} userData.email - The user's email
 * @param {string} userData.password - The user's password
 * @param {string} userData.role - The user's role (ADMIN or CLIENT)
 * @returns {Promise<Object>} The response from the API
 */
export const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData);
  return response.data;
};