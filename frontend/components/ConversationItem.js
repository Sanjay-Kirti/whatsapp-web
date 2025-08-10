import { formatMessageTime, getInitials, generateAvatarColor, truncateText, formatPhoneNumber } from '../lib/utils';

export default function ConversationItem({ 
  conversation, 
  isActive = false, 
  onClick 
}) {
  const { wa_id, lastMessage, unreadCount } = conversation;
  const avatarColor = generateAvatarColor(wa_id);
  const initials = getInitials(formatPhoneNumber(wa_id));

  return (
    <div
      onClick={() => onClick(wa_id)}
      className={`conversation-item ${isActive ? 'active' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
        {initials}
      </div>

      {/* Conversation Details */}
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {formatPhoneNumber(wa_id)}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {lastMessage && formatMessageTime(lastMessage.timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1 min-w-0 flex-1">
            {lastMessage?.direction === 'outbound' && (
              <div className={`flex-shrink-0 ${
                lastMessage.status?.state === 'read' 
                  ? 'text-whatsapp-blue-light' 
                  : 'text-gray-400'
              }`}>
                <svg className="w-3 h-3" viewBox="0 0 16 15" fill="currentColor">
                  <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
                  {(lastMessage.status?.state === 'delivered' || lastMessage.status?.state === 'read') && (
                    <path d="M12.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
                  )}
                </svg>
              </div>
            )}
            
            <p className="text-sm text-gray-600 truncate">
              {lastMessage?.text ? truncateText(lastMessage.text, 30) : 'No messages yet'}
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="bg-whatsapp-green text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center flex-shrink-0 ml-2">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
