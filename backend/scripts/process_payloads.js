const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Message = require('../models/Message');
const { processWebhookPayload } = require('../routes/webhook');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function processPayloadFiles() {
  const payloadsDir = path.join(__dirname, '../payloads');
  
  try {
    // Check if payloads directory exists
    await fs.access(payloadsDir);
  } catch (error) {
    console.error(`Payloads directory not found: ${payloadsDir}`);
    console.log('Please create the payloads directory and add JSON files from the provided zip.');
    process.exit(1);
  }

  try {
    const files = await fs.readdir(payloadsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('No JSON files found in payloads directory');
      return;
    }

    console.log(`Found ${jsonFiles.length} JSON files to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(payloadsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const payload = JSON.parse(fileContent);

        console.log(`Processing file: ${file}`);
        await processWebhookPayload(payload, null); // No socket.io in batch processing
        
        processedCount++;
        console.log(`✅ Successfully processed: ${file}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing file ${file}:`, error.message);
      }
    }

    console.log('\n=== Processing Summary ===');
    console.log(`Total files: ${jsonFiles.length}`);
    console.log(`Successfully processed: ${processedCount}`);
    console.log(`Errors: ${errorCount}`);

    // Display some statistics
    const totalMessages = await Message.countDocuments();
    const conversations = await Message.distinct('wa_id');
    
    console.log(`\n=== Database Statistics ===`);
    console.log(`Total messages in database: ${totalMessages}`);
    console.log(`Total conversations: ${conversations.length}`);

  } catch (error) {
    console.error('Error processing payload files:', error);
  }
}

async function main() {
  console.log('WhatsApp Webhook Payload Processor');
  console.log('==================================');
  
  await connectToDatabase();
  await processPayloadFiles();
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
  console.log('Processing complete!');
}

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, closing database connection...');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, closing database connection...');
  await mongoose.disconnect();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { processPayloadFiles };
