# WhatsApp Web Clone

A full-stack WhatsApp Web clone built with Node.js, Express, MongoDB, Next.js, and Socket.IO. This application processes WhatsApp Business API webhook payloads and displays them in a WhatsApp-like interface.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://whatsapp-web-b2t7.vercel.app/)
- **Backend API**: [Deployed on Render](https://whatsapp-web-86sx.onrender.com)

## 📋 Features

- **Real-time messaging** with Socket.IO
- **WhatsApp-like UI** with responsive design
- **Message status indicators** (sent, delivered, read)
- **Conversation management** grouped by user
- **Webhook payload processing** from WhatsApp Business API
- **Mobile-friendly** responsive design
- **Message sending** (stored in database only)
- **MongoDB Atlas** cloud database integration

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

### Frontend
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **SWR** for data fetching
- **Socket.IO Client** for real-time updates
- **React Hooks** for state management

### Database
- **MongoDB Atlas** (Cloud)
- **Indexed collections** for performance
- **Change streams** for real-time updates

## 📁 Project Structure

```
whatsapp-web/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Message.js
│   ├── routes/
│   │   ├── conversations.js
│   │   ├── messages.js
│   │   └── webhook.js
│   ├── scripts/
│   │   └── process_payloads.js
│   ├── payloads/           # Add your JSON files here
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    ├── components/
    │   ├── ChatWindow.js
    │   ├── ConversationItem.js
    │   ├── MessageBubble.js
    │   ├── MessageInput.js
    │   └── Sidebar.js
    ├── hooks/
    │   ├── useConversations.js
    │   ├── useMessages.js
    │   └── useSocket.js
    ├── lib/
    │   ├── api.js
    │   ├── socket.js
    │   └── utils.js
    ├── package.json
    └── .env.example
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd whatsapp-web
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

**Configure `.env`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your API URLs
```

**Configure `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Add Sample Data

1. Download the sample payloads from the provided Google Drive link
2. Extract the JSON files to `backend/payloads/` directory
3. Run the payload processor:

```bash
cd backend
npm run process-payloads
```

### 5. Start the Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📊 Database Schema

### Message Collection (`processed_messages`)

```javascript
{
  message_id: String,        // Unique message identifier
  meta_msg_id: String,       // Meta message ID for status updates
  wa_id: String,             // WhatsApp user ID
  from: String,              // Sender phone number
  to: String,                // Recipient phone number
  text: String,              // Message text content
  media: {                   // Optional media object
    type: String,            // image, video, audio, document
    url: String,
    filename: String,
    caption: String,
    mime_type: String
  },
  timestamp: Date,           // Message timestamp
  direction: String,         // 'inbound' or 'outbound'
  status: {
    state: String,           // 'sent', 'delivered', 'read'
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date
  },
  raw: Object               // Original webhook payload
}
```

## 🔌 API Endpoints

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:wa_id/messages` - Get messages for a conversation
- `POST /api/conversations/:wa_id/messages` - Send a new message

### Messages
- `GET /api/messages/:id` - Get specific message
- `PUT /api/messages/:id/status` - Update message status

### Webhook
- `POST /webhook` - Receive webhook payloads

### System
- `GET /health` - Health check endpoint

## 🔄 Real-time Events

### Socket.IO Events

**Client → Server:**
- `join:conversation` - Join a conversation room
- `leave:conversation` - Leave a conversation room

**Server → Client:**
- `message:new` - New message received
- `message:update` - Message status updated

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
4. Deploy using the provided `render.yaml`

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. From the frontend directory: `vercel`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SOCKET_URL`
4. Deploy: `vercel --prod`

### Environment Variables for Production

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- **Desktop**: Side-by-side chat list and conversation view
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Full-screen conversation view with back navigation

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run process-payloads  # Process webhook payload files
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI in `.env`
   - Check network access in MongoDB Atlas
   - Ensure your IP is whitelisted

2. **CORS Issues**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check API URLs in frontend `.env.local`

3. **Socket.IO Not Connecting**
   - Ensure both frontend and backend are running
   - Check console for connection errors
   - Verify socket URLs match your backend

4. **No Conversations Showing**
   - Run the payload processor script
   - Check MongoDB for data
   - Verify API endpoints are working

## 📝 Features Implemented

- ✅ Webhook payload processing
- ✅ MongoDB integration with proper schema
- ✅ RESTful API endpoints
- ✅ Real-time Socket.IO communication
- ✅ WhatsApp-like UI design
- ✅ Message status indicators
- ✅ Responsive mobile design
- ✅ Message sending functionality
- ✅ Conversation management
- ✅ Error handling and loading states
- ✅ Production deployment configuration

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Media file uploads
- [ ] Message search functionality
- [ ] Push notifications
- [ ] Message encryption
- [ ] Group chat support
- [ ] Voice messages
- [ ] Message reactions

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please create an issue in the GitHub repository.
Contact: Sanjay Kirti
Email: lukebrushwood@gmail.com

---

**Note**: This is a demonstration project for webhook processing and UI development. No real WhatsApp messages are sent or received.
