import { formatMessageTime } from '../lib/utils';

const StatusTicks = ({ status, direction }) => {
  if (direction !== 'outbound') return null;

  const getTickColor = () => {
    switch (status.state) {
      case 'sent':
        return 'text-gray-400';
      case 'delivered':
        return 'text-gray-500';
      case 'read':
        return 'text-whatsapp-blue-light';
      default:
        return 'text-gray-400';
    }
  };

  const isDoubleCheck = status.state === 'delivered' || status.state === 'read';

  return (
    <div className={`inline-flex items-center ml-1 ${getTickColor()}`}>
      <svg className="w-4 h-4" viewBox="0 0 16 15" fill="currentColor">
        <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
        {isDoubleCheck && (
          <path d="M12.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
        )}
      </svg>
    </div>
  );
};

export default function MessageBubble({ message }) {
  const isOutbound = message.direction === 'outbound';
  const bubbleClass = isOutbound ? 'message-outbound' : 'message-inbound';
  
  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`message-bubble ${bubbleClass} animate-fade-in`}>
        {message.text && (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.text}
          </p>
        )}
        
        {message.media && (
          <div className="mt-2">
            {message.media.type === 'image' && (
              <div className="rounded-lg overflow-hidden max-w-xs">
                <div className="bg-gray-200 h-32 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">📷 Image</span>
                </div>
                {message.media.caption && (
                  <p className="text-sm mt-2">{message.media.caption}</p>
                )}
              </div>
            )}
            
            {message.media.type === 'video' && (
              <div className="rounded-lg overflow-hidden max-w-xs">
                <div className="bg-gray-200 h-32 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">🎥 Video</span>
                </div>
                {message.media.caption && (
                  <p className="text-sm mt-2">{message.media.caption}</p>
                )}
              </div>
            )}
            
            {message.media.type === 'audio' && (
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                <span className="text-gray-500">🎵</span>
                <span className="text-sm">Audio message</span>
              </div>
            )}
            
            {message.media.type === 'document' && (
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                <span className="text-gray-500">📄</span>
                <div>
                  <p className="text-sm font-medium">{message.media.filename || 'Document'}</p>
                  {message.media.caption && (
                    <p className="text-xs text-gray-600">{message.media.caption}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="message-timestamp">
            {formatMessageTime(message.timestamp)}
          </span>
          <StatusTicks status={message.status} direction={message.direction} />
        </div>
      </div>
    </div>
  );
}
