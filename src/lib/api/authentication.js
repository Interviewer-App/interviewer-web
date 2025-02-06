import { api } from "./api";

export async function Login(data) {
  try {
      const response = await api.post(`/auth/login`,data)
      return response.data;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}

export async function signUp(data) {
  try {
      const response = await api.post(`/auth/register`,data)
      return response.data;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}

export async function checkUserAvailability(email) {
  try {
      const response = await api.get(`/auth/check-user-availability/${email}`)
      return response;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}


export async function verifyUserEmail(token) {
  try {
      const response = await api.get(`/auth/verify-email/${token}`)
      return response;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}


export async function providerRegistration(userdata) {
  try {
      const response = await api.post(`/auth/provider-register`,userdata)
      return response.data;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}