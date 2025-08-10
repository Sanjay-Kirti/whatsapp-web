import { useEffect, useRef, useCallback } from 'react';
import socketManager from '../lib/socket';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketManager.connect();

    return () => {
      socketManager.cleanup();
    };
  }, []);

  const joinConversation = useCallback((wa_id) => {
    socketManager.joinConversation(wa_id);
  }, []);

  const leaveConversation = useCallback((wa_id) => {
    socketManager.leaveConversation(wa_id);
  }, []);

  const on = useCallback((event, callback) => {
    socketManager.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketManager.off(event, callback);
  }, []);

  const emit = useCallback((event, data) => {
    socketManager.emit(event, data);
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketManager.isConnected,
    joinConversation,
    leaveConversation,
    on,
    off,
    emit,
  };
}
