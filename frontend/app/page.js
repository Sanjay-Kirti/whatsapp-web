'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, hide sidebar when a conversation is selected
      if (mobile && activeConversation) {
        setShowSidebar(false);
      } else if (!mobile) {
        setShowSidebar(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [activeConversation]);

  const handleSelectConversation = (wa_id) => {
    setActiveConversation(wa_id);
    
    // On mobile, hide sidebar when conversation is selected
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    if (isMobile) {
      setShowSidebar(true);
      setActiveConversation(null);
    }
  };

  return (
    <div className="h-screen flex bg-whatsapp-gray-light">
      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? (showSidebar ? 'w-full' : 'hidden') 
          : 'w-1/3 max-w-sm min-w-[300px]'
      } transition-all duration-300`}>
        <Sidebar
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          className="h-full"
        />
      </div>

      {/* Chat Window */}
      <div className={`${
        isMobile 
          ? (showSidebar ? 'hidden' : 'w-full') 
          : 'flex-1'
      } relative transition-all duration-300`}>
        {/* Mobile back button */}
        {isMobile && activeConversation && (
          <button
            onClick={handleBackToSidebar}
            className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <ChatWindow 
          wa_id={activeConversation} 
          className="h-full"
        />
      </div>
    </div>
  );
}
