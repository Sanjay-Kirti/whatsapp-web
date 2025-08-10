import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd/MM/yyyy');
  }
}

export function formatLastSeen(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return `today at ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy');
  }
}

export function formatRelativeTime(timestamp) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as +XX XXXXX XXXXX
  if (cleaned.length >= 10) {
    const countryCode = cleaned.slice(0, -10);
    const number = cleaned.slice(-10);
    const formatted = number.replace(/(\d{5})(\d{5})/, '$1 $2');
    return countryCode ? `+${countryCode} ${formatted}` : formatted;
  }
  
  return phoneNumber;
}

export function generateAvatarColor(wa_id) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const hash = wa_id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

export function scrollToBottom(element, smooth = true) {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }
}

export function isValidPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
