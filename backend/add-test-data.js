require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');

async function addTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Message.deleteMany({});
    console.log('Cleared existing messages');
    
    // Create test conversations
    const testMessages = [
      // Conversation 1
      {
        message_id: 'msg_001',
        meta_msg_id: 'msg_001',
        wa_id: '1234567890',
        from: '1234567890',
        to: 'system',
        text: 'Hello! This is a test message from conversation 1.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        direction: 'inbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 3600000),
          deliveredAt: new Date(Date.now() - 3600000)
        }
      },
      {
        message_id: 'msg_002',
        meta_msg_id: 'msg_002',
        wa_id: '1234567890',
        from: 'system',
        to: '1234567890',
        text: 'Hi there! This is a reply from the system.',
        timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
        direction: 'outbound',
        status: {
          state: 'read',
          sentAt: new Date(Date.now() - 3000000),
          deliveredAt: new Date(Date.now() - 2900000),
          readAt: new Date(Date.now() - 2800000)
        }
      },
      {
        message_id: 'msg_003',
        meta_msg_id: 'msg_003',
        wa_id: '1234567890',
        from: '1234567890',
        to: 'system',
        text: 'Great! The WhatsApp clone is working perfectly.',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        direction: 'inbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 1800000),
          deliveredAt: new Date(Date.now() - 1800000)
        }
      },
      
      // Conversation 2
      {
        message_id: 'msg_004',
        meta_msg_id: 'msg_004',
        wa_id: '9876543210',
        from: '9876543210',
        to: 'system',
        text: 'Hey! This is conversation 2. How are you?',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        direction: 'inbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 7200000),
          deliveredAt: new Date(Date.now() - 7200000)
        }
      },
      {
        message_id: 'msg_005',
        meta_msg_id: 'msg_005',
        wa_id: '9876543210',
        from: 'system',
        to: '9876543210',
        text: 'I\'m doing well, thanks for asking! How about you?',
        timestamp: new Date(Date.now() - 6600000), // 1 hour 50 minutes ago
        direction: 'outbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 6600000),
          deliveredAt: new Date(Date.now() - 6500000)
        }
      },
      {
        message_id: 'msg_006',
        meta_msg_id: 'msg_006',
        wa_id: '9876543210',
        from: '9876543210',
        to: 'system',
        text: 'All good here! Testing the real-time messaging feature.',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        direction: 'inbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 900000),
          deliveredAt: new Date(Date.now() - 900000)
        }
      },
      
      // Conversation 3
      {
        message_id: 'msg_007',
        meta_msg_id: 'msg_007',
        wa_id: '5555555555',
        from: '5555555555',
        to: 'system',
        text: 'Welcome to WhatsApp Web Clone! 🎉',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        direction: 'inbound',
        status: {
          state: 'delivered',
          sentAt: new Date(Date.now() - 300000),
          deliveredAt: new Date(Date.now() - 300000)
        }
      }
    ];
    
    // Insert test messages
    await Message.insertMany(testMessages);
    console.log(`✅ Added ${testMessages.length} test messages`);
    
    // Verify the data
    const count = await Message.countDocuments();
    const conversations = await Message.distinct('wa_id');
    
    console.log(`📊 Database now has:`);
    console.log(`   - ${count} total messages`);
    console.log(`   - ${conversations.length} conversations`);
    console.log(`   - Conversation IDs: ${conversations.join(', ')}`);
    
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestData();
