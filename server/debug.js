/**
 * Lkeap API Debugging Script
 * This script helps test and debug the Lkeap API integration
 */

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '../.env') });

// Test configuration
const TEST_CONFIG = {
    baseUrl: process.env.LKEAP_BASE_URL || 'https://api.lkeap.cloud.tencent.com/v1',
    apiKey: process.env.LKEAP_API_KEY,
    model: process.env.LKEAP_DEFAULT_MODEL || 'deepseek-v3-0324',
    proxyUrl: process.env.PROXY_URL || `http://localhost:${process.env.PORT || 3000}/api/lkeap`
};

// Test messages for debugging
const TEST_MESSAGES = [
    {
        role: 'system',
        content: 'You are a helpful assistant.'
    },
    {
        role: 'user',
        content: 'Hello, can you help me with a simple test?'
    }
];

async function testDirectLkeapAPI() {
    console.log('=== Testing Direct Lkeap API ===');
    
    if (!TEST_CONFIG.apiKey) {
        console.error('❌ LKEAP_API_KEY is not set in environment variables');
        return false;
    }
    
    try {
        const response = await axios.post(`${TEST_CONFIG.baseUrl}/chat/completions`, {
            model: TEST_CONFIG.model,
            messages: TEST_MESSAGES,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${TEST_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('✅ Direct Lkeap API call successful');
        console.log('Response status:', response.status);
        console.log('Model used:', response.data.model);
        console.log('Response content preview:', response.data.choices[0].message.content.substring(0, 100) + '...');
        return true;
    } catch (error) {
        console.error('❌ Direct Lkeap API call failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        return false;
    }
}

async function testProxyServer() {
    console.log('\n=== Testing Proxy Server ===');
    
    try {
        const response = await axios.post(TEST_CONFIG.proxyUrl, {
            model: TEST_CONFIG.model,
            messages: TEST_MESSAGES,
            temperature: 0.7
        }, {
            timeout: 30000
        });
        
        console.log('✅ Proxy server call successful');
        console.log('Response status:', response.status);
        if (response.data.model) {
            console.log('Model used:', response.data.model);
        }
        if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            console.log('Response content preview:', response.data.choices[0].message.content.substring(0, 100) + '...');
        }
        return true;
    } catch (error) {
        console.error('❌ Proxy server call failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        return false;
    }
}

async function checkEnvironmentVariables() {
    console.log('\n=== Checking Environment Variables ===');
    
    const requiredVars = ['LKEAP_API_KEY'];
    let allSet = true;
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: ${process.env[varName].substring(0, 8)}...`);
        } else {
            console.log(`❌ ${varName}: Not set`);
            allSet = false;
        }
    });
    
    // Optional variables
    const optionalVars = ['LKEAP_BASE_URL', 'LKEAP_DEFAULT_MODEL', 'PORT'];
    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`ℹ️  ${varName}: ${process.env[varName]}`);
        } else {
            console.log(`ℹ️  ${varName}: Not set (using default)`);
        }
    });
    
    return allSet;
}

async function checkProxyServerHealth() {
    console.log('\n=== Checking Proxy Server Health ===');

    // Use the same port logic as the server
    const port = process.env.PORT || 3000;
    const serverUrl = `http://localhost:${port}`;

    try {
        const response = await axios.get(`${serverUrl}/health`, {
            timeout: 5000
        });

        console.log(`✅ Proxy server is running at ${serverUrl}`);
        console.log('Status:', response.data.status);
        console.log('Timestamp:', response.data.timestamp);
        return true;
    } catch (error) {
        console.error(`❌ Proxy server is not responding at ${serverUrl}`);
        console.error('Make sure to start the proxy server with: npm start');
        console.error('Or run in development mode: npm run dev');
        return false;
    }
}

async function runFullDebug() {
    console.log('🚀 Starting Lkeap API Debugging Process...\n');
    
    // Check environment first
    const envOk = await checkEnvironmentVariables();
    if (!envOk) {
        console.log('\n⚠️  Environment variables are not properly configured. Please check your .env file.');
        return;
    }
    
    // Check if proxy server is running
    const proxyRunning = await checkProxyServerHealth();
    
    console.log('\n' + '='.repeat(50));
    
    let directApiOk = false;
    if (envOk) {
        directApiOk = await testDirectLkeapAPI();
    }
    
    let proxyOk = false;
    if (proxyRunning) {
        proxyOk = await testProxyServer();
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 DEBUG SUMMARY:');
    console.log(`Environment Variables: ${envOk ? '✅ OK' : '❌ Issues'}`);
    console.log(`Direct Lkeap API: ${directApiOk ? '✅ Working' : '❌ Issues'}`);
    console.log(`Proxy Server: ${proxyRunning ? '✅ Running' : '❌ Not Running'}`);
    console.log(`Proxy API Call: ${proxyOk ? '✅ Working' : '❌ Issues'}`);
    
    if (proxyOk) {
        console.log('\n✅ All systems are working correctly! The Lkeap API integration is properly configured.');
    } else {
        console.log('\n⚠️  Please fix the identified issues before proceeding.');
    }
}

// Run debug if this script is called directly
if (require.main === module) {
    runFullDebug().catch(console.error);
}

module.exports = {
    testDirectLkeapAPI,
    testProxyServer,
    checkEnvironmentVariables,
    checkProxyServerHealth,
    runFullDebug
};