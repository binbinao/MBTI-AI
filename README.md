---
frameworks:
- Pytorch
license: Apache License 2.0
---
# AI & MBTI Personality Test

## MBTI Personality Test Component
A web-based MBTI personality assessment interface that includes:
- Modern, responsive UI with gradient design
- Three test modes (Short: 8 questions, Standard: 28 questions, Extended: 100+ questions)
- Accessibility features and semantic HTML
- Error handling and validation
- Responsive design for all device sizes
- Integration with Tencent Cloud AI for personality analysis

### Usage
To use the MBTI test, simply open `index.html` in your browser.

### API Integration (Lkeap with DeepSeek Models)

The application includes integration with Lkeap API services for personality analysis using DeepSeek models. To configure the API:

1. Copy `.env.example` to `.env` in the root directory and add your Tencent Lkeap API key
2. Navigate to the `server` directory and install dependencies: `npm install`
3. Start the backend proxy server: `npm start` (or `npm run dev` for development with auto-restart)
4. Keep the backend server running while using the frontend application
5. The API configuration is managed in `config/api-config.js`
6. The service implementation is in `services/lkeap-ai-service.js`
7. Default model is set to `deepseek-v3-0324`

### Project Structure
- `index.html` - Main HTML interface with accessibility features
- `script.js` - JavaScript logic with error handling and validation
- `styles.css` - Responsive styles with modern UI elements
- `config/api-config.js` - API configuration management
- `services/lkeap-ai-service.js` - Lkeap AI service implementation
- `server/api-proxy.js` - Backend proxy for Lkeap API
- `configuration.json` - Framework configuration
- `STARTUP_LESSON.md` - Documentation
- `.env.example` - Environment variables template
- `.gitignore` - Files to ignore during git commits