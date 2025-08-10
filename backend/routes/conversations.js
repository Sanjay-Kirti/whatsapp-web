const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// GET /api/conversations - Get all conversations grouped by wa_id
router.get('/', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$wa_id',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$direction', 'inbound'] },
                    { $ne: ['$status.state', 'read'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalMessages: { $sum: 1 }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      },
      {
        $project: {
          wa_id: '$_id',
          lastMessage: {
            text: '$lastMessage.text',
            timestamp: '$lastMessage.timestamp',
            direction: '$lastMessage.direction',
            status: '$lastMessage.status'
          },
          unreadCount: 1,
          totalMessages: 1,
          _id: 0
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/conversations/:wa_id/messages - Get messages for a specific conversation
router.get('/:wa_id/messages', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ wa_id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-raw'); // Exclude raw payload for performance

    // Reverse to show oldest first
    messages.reverse();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/conversations/:wa_id/messages - Send a new message
router.post('/:wa_id/messages', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { text, media } = req.body;

    if (!text && !media) {
      return res.status(400).json({ error: 'Message text or media is required' });
    }

    const message = new Message({
      message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wa_id,
      from: 'system', // In a real app, this would be the authenticated user
      to: wa_id,
      text: text || '',
      media,
      direction: 'outbound',
      status: {
        state: 'sent',
        sentAt: new Date()
      }
    });

    await message.save();

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('message:new', {
        wa_id,
        message: message.toObject()
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
