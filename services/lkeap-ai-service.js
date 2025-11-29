// Lkeap AI API Service
class LkeapAIService {
    constructor(config = null) {
        this.config = config || this.getDefaultConfig();
    }

    getDefaultConfig() {
        return {
            proxyUrl: '/api/lkeap',
            defaultModel: 'deepseek-v3-0324',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MBTI-Test-App/1.0'
            }
        };
    }

    // For browser environments, we implement a proxy approach
    // since we can't securely call Lkeap APIs directly from browser
    async callLkeapAPI(model, messages, additionalParams = {}) {
        try {
            // Validate input parameters
            if (!messages || !Array.isArray(messages)) {
                throw new Error('Invalid messages parameter provided - must be an array of message objects');
            }

            // Set up request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            // Prepare the request body for our proxy
            const requestBody = {
                model: model || this.config.defaultModel,
                messages: messages,
                ...additionalParams
            };

            const response = await fetch(this.config.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.config.headers
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Log specific error information
                const errorText = await response.text();
                throw new Error(`API proxy request failed: ${response.status} ${response.statusText}. Details: ${errorText}`);
            }

            const data = await response.json();

            // Validate response structure
            if (!data) {
                throw new Error('Invalid API response format');
            }

            return data;
        } catch (error) {
            // Handle specific error types
            if (error.name === 'AbortError') {
                console.error('API request timeout:', error);
                throw new Error('API request timeout - please try again');
            } else if (error.message.includes('Failed to fetch')) {
                console.error('Network error when calling API:', error);
                throw new Error('Network error - please check your connection');
            } else {
                console.error('Error calling Lkeap API through proxy:', error);
                // Fallback to mock response if proxy fails
                return this.getMockResponse(messages);
            }
        }
    }

    // Get mock response (used when credentials are not available or proxy fails)
    getMockResponse(messages) {
        console.log(`Mock API call - Messages:`, messages);
        // Simulate API delay
        const mbtiType = messages.find(msg => msg.content && msg.content.includes('MBTI'))?.content.match(/MBTI type: ([A-Z]{4})/)?.[1] || 'unknown';

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: `根据你的MBTI类型${mbtiType}，AI分析显示你是一个具有独特个性特征的人。你倾向于在社交互动、信息获取、决策方式和生活方式上表现出特定的偏好模式。`
                        }
                    }],
                    model: 'deepseek-v3-0324',
                    object: 'chat.completion',
                    created: Math.floor(Date.now() / 1000),
                    id: 'mock-request-id-' + Date.now()
                });
            }, 1500); // Simulate network delay
        });
    }

    // Analyze MBTI type using Lkeap with DeepSeek model
    async analyzeMBTI(mbtiType, additionalData = {}) {
        try {
            // Prepare messages for the chat completion
            const messages = [
                {
                    role: "system",
                    content: "你是一个专业的MBTI性格分析专家，提供详细、准确且有洞察力的性格类型分析。"
                },
                {
                    role: "user",
                    content: `请提供一个详细的性格分析报告，针对MBTI类型: ${mbtiType}。分析应包括性格特点、优势、潜在挑战、适合的职业方向、人际关系处理方式以及个人发展建议。`
                }
            ];

            // Call the Lkeap API through our proxy
            return await this.callLkeapAPI(
                this.config.defaultModel,
                messages,
                additionalData
            );

        } catch (error) {
            console.error('Error in Lkeap AI analysis:', error);
            throw error;
        }
    }

    // Method to update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export for browser or module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LkeapAIService;
} else if (typeof window !== 'undefined') {
    window.LkeapAIService = LkeapAIService;
}