# WhatsApp Web Clone - Frontend

Next.js frontend application for the WhatsApp Web clone.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your API URLs

# Start development server
npm run dev
```

## 📋 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Socket.IO integration for live messaging
- **WhatsApp-like UI**: Authentic WhatsApp Web appearance
- **Message Status**: Visual indicators for sent/delivered/read
- **Conversation Management**: Grouped conversations with unread counts
- **Mobile Navigation**: Collapsible sidebar on mobile devices

## 🧩 Components

### Core Components
- `Sidebar`: Conversation list with search
- `ChatWindow`: Main chat interface
- `MessageBubble`: Individual message display
- `MessageInput`: Message composition
- `ConversationItem`: Conversation list item

### Custom Hooks
- `useConversations`: Fetch and manage conversations
- `useMessages`: Fetch and manage messages for a conversation
- `useSocket`: Socket.IO connection management

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
# NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

## 📱 Responsive Behavior

- **Desktop (≥768px)**: Side-by-side layout
- **Mobile (<768px)**: Full-screen conversation with back button

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: WhatsApp-themed design system
- **Responsive Grid**: Mobile-first approach
