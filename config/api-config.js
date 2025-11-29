// API配置文件
const API_CONFIG = {
    // 根据环境自动判断API基础URL
    get BASE_URL() {
        if (typeof window !== 'undefined') {
            // 浏览器环境
            const isDevelopment = window.location.hostname === 'localhost' || 
                                 window.location.hostname === '127.0.0.1';
            
            if (isDevelopment) {
                return 'http://localhost:3000'; // 本地开发环境
            } else {
                return ''; // Vercel生产环境，使用相对路径
            }
        } else {
            // Node.js环境
            return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
        }
    },

    // API端点
    ENDPOINTS: {
        LKEAP: '/api/lkeap',
        HEALTH: '/api/health'
    },

    // 获取完整的API URL
    getApiUrl(endpoint) {
        return `${this.BASE_URL}${endpoint}`;
    },

    // 请求配置
    REQUEST_CONFIG: {
        timeout: 30000, // 30秒超时
        retries: 3,     // 重试次数
        retryDelay: 1000 // 重试延迟(毫秒)
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
}