const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/database');
const conversationsRouter = require('./routes/conversations');
const messagesRouter = require('./routes/messages');
const { router: webhookRouter } = require('./routes/webhook');

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp Web Clone API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      conversations: '/api/conversations',
      messages: '/api/messages',
      webhook: '/webhook'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/webhook', webhookRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Join conversation room
  socket.on('join:conversation', (wa_id) => {
    socket.join(`conversation:${wa_id}`);
    console.log(`Client ${socket.id} joined conversation: ${wa_id}`);
  });
  
  // Leave conversation room
  socket.on('leave:conversation', (wa_id) => {
    socket.leave(`conversation:${wa_id}`);
    console.log(`Client ${socket.id} left conversation: ${wa_id}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Database connection and server startup
async function startServer() {
  try {
    const { connection, changeStream } = await connectDB();
    
    // Set up MongoDB change streams for real-time updates
    if (changeStream) {
      changeStream.on('change', (change) => {
        try {
          if (change.operationType === 'insert') {
            const message = change.fullDocument;
            io.emit('message:new', {
              wa_id: message.wa_id,
              message: message
            });
          } else if (change.operationType === 'update') {
            const messageId = change.documentKey._id;
            io.emit('message:update', {
              message_id: messageId,
              updatedFields: change.updateDescription.updatedFields
            });
          }
        } catch (error) {
          console.error('Error processing change stream event:', error);
        }
      });
    }
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();
