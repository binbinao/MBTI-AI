# Lkeap AI API Proxy

This is a backend proxy service that securely handles API calls to Lkeap AI services with DeepSeek models. The proxy is necessary because:

1. Lkeap API credentials cannot be safely stored in browser code
2. Browser security restrictions prevent direct cross-origin API calls
3. API authentication requires server-side processing

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` in the root directory (../.env) and add your Lkeap credentials
3. Start the server: `npm start`
4. For development with auto-restart: `npm run dev`

## Usage

The proxy accepts POST requests at `/api/lkeap` with the following structure:

```json
{
  "model": "deepseek-v3-0324",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant"
    },
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7
}
```

## Environment Variables

Create a `.env` file with the following variables:

```env
LKEAP_API_KEY=your_lkeap_api_key_here
LKEAP_BASE_URL=https://api.lkeap.cloud.tencent.com/v1
LKEAP_DEFAULT_MODEL=deepseek-v3-0324
PORT=3000
```

## Security Notes

- Never commit your `.env` file to version control
- Use HTTPS in production
- Implement proper rate limiting
- Add authentication if needed for your application