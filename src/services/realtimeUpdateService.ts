import { fetchRequestData } from '@/redux/slices/requestSlice';
import { AppDispatch } from '@/redux/store';
import { io } from 'socket.io-client';

let socket: any;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL);
    socket.on("connect", () => {
      console.log('Connected: ', socket.id);
    });
  }
};

export const updateRequestRealtime = (dispatch: AppDispatch) => {
  if (!socket) return;

  const handleUpdateRequest = (response: any) => {
    dispatch(fetchRequestData())
  };

  const handleUpdateComment = (response: any) => {
    dispatch(fetchRequestData())
  };

  socket.on('update_request', handleUpdateRequest);
  socket.on('update_comment', handleUpdateComment);

  socket.on("disconnect", () => {
    console.log('Disconnected: ', socket.id);
  });

  // Return cleanup function to remove listeners
  return () => {
    if (socket && socket.connected) {
      socket.off('update_request', handleUpdateRequest);
      socket.off('update_comment', handleUpdateComment);
    }
  };
};

export const closeSocketAPI = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Reset socket instance
  }
};