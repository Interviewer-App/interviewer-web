export const getToken = async () => {
  try {
      const token = localStorage.getItem('accessToken');
      return token;
      
  } catch (error) {
      console.log('Error retrieving token:', error);
      return null;
  }
};

export const setToken = (token) => {
  try {
      localStorage.setItem('accessToken', token);
      
  } catch (error) {
      console.log('Error storing token:', error);
  }
};

export const removeToken = () => {
  try {
      localStorage.removeItem('accessToken');
  } catch (error) {
      console.log('Error removing token:', error);
  }
};