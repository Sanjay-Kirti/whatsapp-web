const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  meta_msg_id: {
    type: String
  },
  wa_id: {
    type: String,
    required: true,
    index: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  media: {
    type: {
      type: String, // image, video, audio, document
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    filename: String,
    caption: String,
    mime_type: String
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  status: {
    state: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    deliveredAt: Date,
    readAt: Date
  },
  raw: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound index for efficient conversation queries
messageSchema.index({ wa_id: 1, timestamp: -1 });

// Index for status updates
messageSchema.index({ meta_msg_id: 1 });

module.exports = mongoose.model('Message', messageSchema, 'processed_messages');
