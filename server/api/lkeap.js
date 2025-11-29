const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 腾讯云LKEAP API代理端点
app.post('/api/lkeap', async (req, res) => {
    try {
        const { model, messages, temperature, max_tokens } = req.body;
        
        // 从环境变量获取API密钥
        const apiKey = process.env.LKEAP_API_KEY;
        const apiUrl = process.env.LKEAP_API_URL || 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
        
        if (!apiKey) {
            return res.status(500).json({
                error: 'API密钥未配置',
                message: '请在环境变量中设置LKEAP_API_KEY'
            });
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || 'deepseek-v3-0324',
                messages: messages,
                temperature: temperature || 0.7,
                max_tokens: max_tokens || 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        res.json(result);
        
    } catch (error) {
        console.error('LKEAP API Error:', error);
        res.status(500).json({
            error: 'API调用失败',
            message: error.message
        });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;