const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// POST /webhook - Receive webhook payloads
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    
    // Process the webhook payload
    await processWebhookPayload(payload, req.io);
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Function to process webhook payload
async function processWebhookPayload(payload, io) {
  try {
    // Handle your custom JSON structure with metaData wrapper
    let webhookData = payload;
    
    // Check if this is your custom format with metaData wrapper
    if (payload.metaData && payload.metaData.entry) {
      webhookData = payload.metaData;
      console.log('Processing custom format payload:', payload._id);
    }
    
    // Handle different types of webhook events
    if (webhookData.entry && webhookData.entry[0] && webhookData.entry[0].changes) {
      const changes = webhookData.entry[0].changes;
      
      for (const change of changes) {
        if (change.value && change.value.messages) {
          // Process incoming messages
          for (const message of change.value.messages) {
            await processIncomingMessage(message, change.value.metadata, payload, io);
          }
        }
        
        if (change.value && change.value.statuses) {
          // Process status updates
          for (const status of change.value.statuses) {
            await processStatusUpdate(status, io);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in processWebhookPayload:', error);
    throw error;
  }
}

// Process incoming message
async function processIncomingMessage(messageData, metadata, rawPayload, io) {
  try {
    const message = new Message({
      message_id: messageData.id,
      meta_msg_id: messageData.id,
      wa_id: messageData.from,
      from: messageData.from,
      to: metadata.phone_number_id,
      text: messageData.text ? messageData.text.body : '',
      media: extractMediaInfo(messageData),
      timestamp: new Date(parseInt(messageData.timestamp) * 1000),
      direction: 'inbound',
      status: {
        state: 'delivered',
        sentAt: new Date(parseInt(messageData.timestamp) * 1000),
        deliveredAt: new Date()
      },
      raw: rawPayload
    });

    await message.save();

    // Emit real-time update
    if (io) {
      io.emit('message:new', {
        wa_id: messageData.from,
        message: message.toObject()
      });
    }

    console.log(`Processed incoming message: ${messageData.id}`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`Message ${messageData.id} already exists, skipping...`);
    } else {
      console.error('Error processing incoming message:', error);
      throw error;
    }
  }
}

// Process status update
async function processStatusUpdate(statusData, io) {
  try {
    const updateData = {
      'status.state': statusData.status
    };

    // Set appropriate timestamp
    const now = new Date();
    if (statusData.status === 'delivered') {
      updateData['status.deliveredAt'] = now;
    } else if (statusData.status === 'read') {
      updateData['status.readAt'] = now;
      updateData['status.deliveredAt'] = updateData['status.deliveredAt'] || now;
    }

    const message = await Message.findOneAndUpdate(
      { $or: [{ message_id: statusData.id }, { meta_msg_id: statusData.id }] },
      updateData,
      { new: true }
    );

    if (message) {
      // Emit real-time update
      if (io) {
        io.emit('message:update', {
          wa_id: message.wa_id,
          message_id: message.message_id,
          status: message.status
        });
      }
      
      console.log(`Updated message status: ${statusData.id} -> ${statusData.status}`);
    } else {
      console.log(`Message not found for status update: ${statusData.id}`);
    }
  } catch (error) {
    console.error('Error processing status update:', error);
    throw error;
  }
}

// Extract media information from message data
function extractMediaInfo(messageData) {
  if (messageData.image) {
    return {
      type: 'image',
      url: messageData.image.id,
      caption: messageData.image.caption,
      mime_type: messageData.image.mime_type
    };
  }
  
  if (messageData.video) {
    return {
      type: 'video',
      url: messageData.video.id,
      caption: messageData.video.caption,
      mime_type: messageData.video.mime_type
    };
  }
  
  if (messageData.audio) {
    return {
      type: 'audio',
      url: messageData.audio.id,
      mime_type: messageData.audio.mime_type
    };
  }
  
  if (messageData.document) {
    return {
      type: 'document',
      url: messageData.document.id,
      filename: messageData.document.filename,
      caption: messageData.document.caption,
      mime_type: messageData.document.mime_type
    };
  }
  
  return null;
}

module.exports = { router, processWebhookPayload };
