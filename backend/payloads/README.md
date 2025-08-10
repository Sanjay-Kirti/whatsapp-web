# Webhook Payloads Directory

This directory should contain the JSON payload files from the WhatsApp Business API webhooks.

## Setup Instructions

1. **Download** the sample payloads from the provided Google Drive link:
   https://drive.google.com/file/d/1pWZ9HaHLza8k080pP_GhvKIl8j2voy-U/view?usp=sharing

2. **Extract** all JSON files from the downloaded ZIP to this directory

3. **Run** the payload processor to import into MongoDB:
   ```bash
   cd backend
   npm run process-payloads
   ```

## Expected File Structure

After downloading and extracting, this directory should look like:

```
payloads/
├── README.md (this file)
├── message_payload_1.json
├── message_payload_2.json
├── status_payload_1.json
├── status_payload_2.json
└── ... (other JSON files from the ZIP)
```

## What the Processor Does

The `process_payloads.js` script will:
- Read all JSON files in this directory
- Parse WhatsApp webhook payloads
- Insert messages into MongoDB
- Update message statuses
- Display processing statistics

## Sample Payload Structure

The JSON files should contain WhatsApp Business API webhook payloads like:

```json
{
  "entry": [
    {
      "id": "PHONE_NUMBER_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "PHONE_NUMBER",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "messages": [
              {
                "from": "PHONE_NUMBER",
                "id": "MESSAGE_ID",
                "timestamp": "TIMESTAMP",
                "text": {
                  "body": "MESSAGE_BODY"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## Troubleshooting

- **No JSON files found**: Make sure you extracted the files to this exact directory
- **Processing errors**: Check that JSON files are valid WhatsApp webhook format
- **Database errors**: Verify your MongoDB connection in `.env`
