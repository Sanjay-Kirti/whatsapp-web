require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check total messages
    const count = await Message.countDocuments();
    console.log('Total messages in DB:', count);
    
    // Check distinct conversations
    const conversations = await Message.distinct('wa_id');
    console.log('Conversations (wa_id):', conversations);
    
    // Get a sample message
    const sample = await Message.findOne();
    console.log('Sample message:', JSON.stringify(sample, null, 2));
    
    // Test the conversations API logic
    const conversationsData = await Message.aggregate([
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
      }
    ]);
    
    console.log('Conversations API result:', JSON.stringify(conversationsData, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDatabase();
