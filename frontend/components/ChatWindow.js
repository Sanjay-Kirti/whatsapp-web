import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useMessages } from '../hooks/useMessages';
import { useSocket } from '../hooks/useSocket';
import { conversationsAPI } from '../lib/api';
import { formatPhoneNumber, getInitials, generateAvatarColor, formatLastSeen, scrollToBottom } from '../lib/utils';

export default function ChatWindow({ wa_id, className = '' }) {
  const { messages, isLoading, mutate } = useMessages(wa_id);
  const { joinConversation, leaveConversation, on, off } = useSocket();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Join/leave conversation rooms
  useEffect(() => {
    if (wa_id) {
      joinConversation(wa_id);
      return () => leaveConversation(wa_id);
    }
  }, [wa_id, joinConversation, leaveConversation]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.wa_id === wa_id) {
        mutate();
        // Auto-scroll if user is at bottom
        setTimeout(() => {
          if (isAtBottom) {
            scrollToBottom(messagesContainerRef.current);
          }
        }, 100);
      }
    };

    const handleMessageUpdate = (data) => {
      if (data.wa_id === wa_id) {
        mutate();
      }
    };

    on('message:new', handleNewMessage);
    on('message:update', handleMessageUpdate);

    return () => {
      off('message:new', handleNewMessage);
      off('message:update', handleMessageUpdate);
    };
  }, [wa_id, mutate, on, off, isAtBottom]);

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      scrollToBottom(messagesContainerRef.current, false);
    }
  }, [wa_id]); // Only on conversation change

  // Handle scroll to detect if user is at bottom
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setIsAtBottom(isNearBottom);
    }
  };

  const handleSendMessage = async (messageData) => {
    try {
      await conversationsAPI.sendMessage(wa_id, messageData);
      mutate(); // Refresh messages
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom(messagesContainerRef.current);
        setIsAtBottom(true);
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const scrollToBottomButton = () => {
    scrollToBottom(messagesContainerRef.current);
    setIsAtBottom(true);
  };

  if (!wa_id) {
    return (
      <div className={`bg-whatsapp-gray flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-32 h-32 mx-auto mb-4 opacity-20">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-2">WhatsApp Web</h2>
          <p className="text-sm max-w-md">
            Send and receive messages without keeping your phone online.<br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  const avatarColor = generateAvatarColor(wa_id);
  const initials = getInitials(formatPhoneNumber(wa_id));
  const lastMessage = messages[messages.length - 1];

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-medium text-sm`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-gray-900 truncate">
              {formatPhoneNumber(wa_id)}
            </h2>
            <p className="text-sm text-gray-500">
              {lastMessage ? `last seen ${formatLastSeen(lastMessage.timestamp)}` : 'No recent activity'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f2f5' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start a conversation by sending a message</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message._id || message.message_id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && messages.length > 0 && (
        <div className="absolute bottom-20 right-8">
          <button
            onClick={scrollToBottomButton}
            className="bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
