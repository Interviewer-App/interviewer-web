// import { useEffect, useCallback } from 'react';
// import { socket } from '../lib/utils/socket';

// export const useSocket = () => {
//   useEffect(() => {
//     if (!socket.connected) {
//       socket.connect();
//     }
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const emit = useCallback((event, data) => {
//     socket.emit(event, data);
//   }, []);

//   return { socket, emit };
// };