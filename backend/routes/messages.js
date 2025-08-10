const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// PUT /api/messages/:id/status - Update message status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    if (!['sent', 'delivered', 'read'].includes(state)) {
      return res.status(400).json({ error: 'Invalid status state' });
    }

    const updateData = {
      'status.state': state
    };

    // Set timestamp based on status
    if (state === 'delivered') {
      updateData['status.deliveredAt'] = new Date();
    } else if (state === 'read') {
      updateData['status.readAt'] = new Date();
      updateData['status.deliveredAt'] = updateData['status.deliveredAt'] || new Date();
    }

    const message = await Message.findOneAndUpdate(
      { $or: [{ message_id: id }, { meta_msg_id: id }] },
      updateData,
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('message:update', {
        wa_id: message.wa_id,
        message_id: message.message_id,
        status: message.status
      });
    }

    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// GET /api/messages/:id - Get specific message
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findOne({
      $or: [{ message_id: id }, { meta_msg_id: id }]
    }).select('-raw');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

module.exports = router;
