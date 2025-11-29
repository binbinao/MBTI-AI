// API Configuration for Tencent Cloud AI Integration
const APIConfig = {
    // Default API settings - these will be overridden by environment variables if available
    baseURL: 'https://api.tencentcloudapi.com',
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MBTI-Test-App/1.0'
    },
    
    // API endpoints
    endpoints: {
        aiAnalysis: '/nlp/text-ai-analysis',
        // Add other endpoints as needed
    },
    
    // Get API settings from environment or use defaults
    getSettings: function() {
        // In a real environment, these would come from environment variables
        // For browser environments, we might need a different approach
        return {
            secretId: this.getEnvVariable('TENCENT_SECRET_ID', ''),
            secretKey: this.getEnvVariable('TENCENT_SECRET_KEY', ''), 
            region: this.getEnvVariable('TENCENT_REGION', 'ap-beijing'),
            service: this.getEnvVariable('TENCENT_SERVICE', 'nlp'),
            version: this.getEnvVariable('TENCENT_VERSION', '2019-04-11'),
            timeout: this.timeout,
            headers: { ...this.headers }
        };
    },
    
    // Helper function to get environment variable (adapted for browser environment)
    getEnvVariable: function(key, defaultValue) {
        // In browser environments, we typically don't have environment variables
        // This implementation looks for variables in the window object or returns default
        if (typeof window !== 'undefined' && window[key]) {
            return window[key];
        }
        return defaultValue;
    }
};

// Export for browser or module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIConfig;
} else if (typeof window !== 'undefined') {
    window.APIConfig = APIConfig;
}