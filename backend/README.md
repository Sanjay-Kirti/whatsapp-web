# WhatsApp Web Clone - Backend

Node.js/Express backend API for the WhatsApp Web clone application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Process webhook payloads
npm run process-payloads
```

## 📋 Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
WEBHOOK_SECRET=optional_webhook_secret
```

## 🔌 API Endpoints

### Conversations
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:wa_id/messages` - Get messages for conversation
- `POST /api/conversations/:wa_id/messages` - Send new message

### Messages
- `GET /api/messages/:id` - Get specific message
- `PUT /api/messages/:id/status` - Update message status

### Webhook
- `POST /webhook` - Process webhook payloads

### System
- `GET /health` - Health check

## 📊 Database Schema

The application uses MongoDB with the following collections:

### processed_messages
- Stores all WhatsApp messages and their metadata
- Indexed on `message_id`, `meta_msg_id`, and `{wa_id, timestamp}`
- Supports real-time updates via change streams

## 🔄 Payload Processing

1. Download sample payloads from the provided Google Drive link
2. Extract JSON files to the `payloads/` directory
3. Run: `npm run process-payloads`

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy using the provided `render.yaml`

### Docker Deployment
```bash
docker build -t whatsapp-backend .
docker run -p 5000:5000 --env-file .env whatsapp-backend
```
