// 简单的API测试脚本
const app = require('./api/lkeap');

// 模拟请求测试
const testRequest = {
    body: {
        model: 'deepseek-v3-0324',
        messages: [
            {
                role: 'user',
                content: '测试消息'
            }
        ],
        temperature: 0.7,
        max_tokens: 100
    }
};

// 模拟响应对象
const mockResponse = {
    status: (code) => ({
        json: (data) => {
            console.log(`Response Status: ${code}`);
            console.log('Response Body:', JSON.stringify(data, null, 2));
        }
    }),
    json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
    }
};

console.log('Testing API endpoint...');
console.log('Make sure to set LKEAP_API_KEY environment variable before running tests.');