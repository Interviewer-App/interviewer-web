import { io } from 'socket.io-client';


const socket = io('http://localhost:3333'); // Adjust the URL to your backend

export default socket;