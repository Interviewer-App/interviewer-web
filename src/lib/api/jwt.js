import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
};

export default isTokenExpired;