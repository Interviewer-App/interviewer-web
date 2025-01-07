import axios from 'axios';
import axiosInstance from "@/lib/api/axioinstance";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});



export { api };