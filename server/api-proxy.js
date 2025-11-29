/**
 * Lkeap AI API Proxy
 * This is a backend proxy to securely handle Lkeap API calls with DeepSeek models
 *
 * IMPORTANT: This is an example implementation. In a production environment,
 * you would need to implement proper authentication, validation, and security measures.
 */

const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes to allow frontend access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // In production, specify your frontend domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Enhanced logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();

    // Log incoming request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentLength: req.get('Content-Length')
    });

    // Capture the original send method to log responses
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Response ${res.statusCode} (${duration}ms)`);

        if (process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development') {
            // Log truncated response for debugging (only in dev mode)
            try {
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                console.log(`Response preview:`, {
                    model: parsedData.model,
                    choicesCount: parsedData.choices?.length,
                    created: parsedData.created
                });
            } catch (e) {
                console.log(`Response preview: Non-JSON response`);
            }
        }

        res.send = originalSend; // Restore original method
        return res.send(data);
    };

    next();
});

app.use(express.json({
    verify: (req, res, buf, encoding) => {
        // Log raw body when in debug mode
        if (process.env.DEBUG === 'true') {
            console.log(`[${new Date().toISOString()}] Raw request body:`, buf.toString());
        }
    }
}));

// Middleware for parsing request bodies
app.use('/api/lkeap', async (req, res) => {
    const startTime = Date.now();
    let apiResponseTime;

    try {
        const { model, messages, ...otherParams } = req.body;

        // Log request details
        console.log(`[${new Date().toISOString()}] Processing Lkeap API request`, {
            model: model || 'default',
            messageCount: messages ? messages.length : 0,
            ip: req.ip,
            processingStage: 'validation'
        });

        // Validate required parameters
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn(`[${new Date().toISOString()}] Invalid request: missing messages`, {
                providedMessages: messages
            });

            return res.status(400).json({
                error: 'Missing required parameter: messages (array of message objects)'
            });
        }

        // Validate credentials are present in environment
        const apiKey = process.env.LKEAP_API_KEY;

        if (!apiKey) {
            console.error(`[${new Date().toISOString()}] Server configuration error: Lkeap API key not set`);
            return res.status(500).json({
                error: 'Server configuration error: Lkeap API key not set'
            });
        }

        // Use default model if not provided
        const modelToUse = model || process.env.LKEAP_DEFAULT_MODEL || 'deepseek-v3-0324';

        // Prepare API request to Lkeap
        const lkeapApiUrl = process.env.LKEAP_BASE_URL || 'https://api.lkeap.cloud.tencent.com/v1';
        const endpoint = `${lkeapApiUrl}/chat/completions`;

        // Prepare the API request body for Lkeap
        const apiRequest = {
            model: modelToUse,
            messages: messages,
            ...otherParams // Include any additional parameters like temperature, max_tokens, etc.
        };

        // Log the request (excluding API key for security)
        console.log(`[${new Date().toISOString()}] Prepared Lkeap API request`, {
            model: apiRequest.model,
            messageCount: apiRequest.messages.length,
            totalCharacters: apiRequest.messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0),
            timestamp: startTime
        });

        // Make the actual API call to Lkeap
        const response = await axios.post(endpoint, apiRequest, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: parseInt(process.env.API_TIMEOUT) || 30000 // 30 second timeout
        });

        apiResponseTime = Date.now();

        console.log(`[${new Date().toISOString()}] Lkeap API call successful`, {
            model: response.data.model,
            responseTime: apiResponseTime - startTime,
            choicesCount: response.data.choices?.length,
            created: response.data.created
        });

        // Return the response from Lkeap
        res.json(response.data);

    } catch (error) {
        const errorTime = Date.now();
        console.error(`[${new Date().toISOString()}] Error calling Lkeap API:`, {
            error: error.message,
            responseTime: errorTime - startTime,
            type: error.code || 'unknown',
            processingStage: error.config ? 'api_call' : 'validation'
        });

        // Handle different types of errors appropriately
        if (error.response) {
            // Server responded with error status
            console.error(`[${new Date().toISOString()}] Lkeap API Error Response:`, {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });

            res.status(error.response.status).json({
                error: 'Lkeap API request failed',
                status: error.response.status,
                details: error.response.data || error.response.statusText,
                timestamp: new Date().toISOString()
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error(`[${new Date().toISOString()}] Network Error:`, {
                message: error.message,
                code: error.code
            });

            res.status(503).json({
                error: 'No response from Lkeap API',
                details: `Network error: ${error.code || error.message}`,
                timestamp: new Date().toISOString()
            });
        } else {
            // Something else happened
            console.error(`[${new Date().toISOString()}] Internal Error:`, {
                message: error.message,
                stack: error.stack
            });

            res.status(500).json({
                error: 'Internal server error while calling Lkeap API',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }
    } finally {
        const totalTime = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Request completed`, {
            totalTime: totalTime + 'ms',
            endpoint: '/api/lkeap'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        processId: process.pid,
        environment: process.env.NODE_ENV || 'development'
    };

    console.log(`[${new Date().toISOString()}] Health check requested`, healthData);
    res.json(healthData);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Unhandled error:`, {
        error: error.message,
        stack: error.stack,
        path: req.path
    });

    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Lkeap AI Proxy server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        endpoint: `http://localhost:${PORT}/api/lkeap`,
        timestamp: new Date().toISOString()
    });

    console.log(`  Environment variables status:`, {
        LKEAP_BASE_URL: process.env.LKEAP_BASE_URL || 'using default',
        LKEAP_DEFAULT_MODEL: process.env.LKEAP_DEFAULT_MODEL || 'using default',
        API_TIMEOUT: process.env.API_TIMEOUT || 'using default'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log(`[${new Date().toISOString()}] Received SIGTERM, shutting down gracefully`);
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log(`[${new Date().toISOString()}] Received SIGINT, shutting down gracefully`);
    process.exit(0);
});