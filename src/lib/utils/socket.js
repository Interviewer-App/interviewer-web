import { io } from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_API_URL_SOCKET); // Adjust the URL to your backend

export default socket;