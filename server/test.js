/**
 * Lkeap API Validation Tests
 * This script runs comprehensive tests to validate the API functionality
 */

const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), '../.env') });

const TEST_CONFIG = {
    proxyUrl: process.env.PROXY_URL || `http://localhost:${process.env.PORT || 3000}/api/lkeap`,
    model: process.env.LKEAP_DEFAULT_MODEL || 'deepseek-v3-0324',
    timeout: 30000
};

// Test cases
const TEST_CASES = [
    {
        name: "Basic MBTI Analysis Request",
        payload: {
            model: TEST_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的MBTI性格分析专家"
                },
                {
                    role: "user",
                    content: "请分析INTJ类型的个性特征"
                }
            ]
        }
    },
    {
        name: "Simple Hello Request",
        payload: {
            model: TEST_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: "Hello, how are you?"
                }
            ]
        }
    },
    {
        name: "Long Context Request",
        payload: {
            model: TEST_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. Please provide detailed responses."
                },
                {
                    role: "user",
                    content: "Can you explain in detail the differences between various MBTI personality types, focusing on how they approach problem solving and decision making?"
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        }
    },
    {
        name: "Invalid Request - No Messages",
        payload: {
            model: TEST_CONFIG.model
        },
        expectError: true
    },
    {
        name: "Model Override Test",
        payload: {
            model: TEST_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: "What model are you?"
                }
            ]
        }
    }
];

let passedTests = 0;
let failedTests = 0;
const testResults = [];

async function runTest(testCase) {
    console.log(`\n🧪 Running test: ${testCase.name}`);
    
    try {
        const startTime = Date.now();
        const response = await axios.post(TEST_CONFIG.proxyUrl, testCase.payload, {
            timeout: TEST_CONFIG.timeout
        });
        const endTime = Date.now();
        
        const testResult = {
            name: testCase.name,
            passed: !testCase.expectError,
            responseTime: endTime - startTime,
            status: response.status,
            data: response.data
        };
        
        if (testCase.expectError) {
            console.log(`❌ Expected error but got success - ${response.status}`);
            testResult.passed = false;
            failedTests++;
        } else {
            console.log(`✅ Test passed - Status: ${response.status}, Time: ${testResult.responseTime}ms`);
            
            // Additional validation for successful responses
            if (response.data.choices && response.data.choices.length > 0) {
                const contentLength = response.data.choices[0].message?.content?.length || 0;
                console.log(`   Response content length: ${contentLength} characters`);
            }
            
            if (response.data.model) {
                console.log(`   Model used: ${response.data.model}`);
            }
            
            passedTests++;
        }
        
        testResults.push(testResult);
        return testResult;
    } catch (error) {
        const testResult = {
            name: testCase.name,
            passed: testCase.expectError,
            error: error.message
        };
        
        if (testCase.expectError) {
            console.log(`✅ Expected error occurred: ${error.response?.status || 'Network Error'}`);
            console.log(`   Error: ${error.response?.data?.error || error.message}`);
            passedTests++;
        } else {
            console.log(`❌ Test failed with error: ${error.message}`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data:`, error.response.data);
            }
            failedTests++;
        }
        
        testResults.push(testResult);
        return testResult;
    }
}

async function checkServerStatus() {
    console.log('\n🔍 Checking if proxy server is running...');

    // Use the same port logic as the server
    const port = process.env.PORT || 3000;
    const serverUrl = `http://localhost:${port}`;

    try {
        const response = await axios.get(`${serverUrl}/health`, {
            timeout: 5000
        });

        console.log(`✅ Server is running at ${serverUrl} - Status: ${response.data.status}`);
        console.log(`   Timestamp: ${response.data.timestamp}`);
        console.log(`   Uptime: ${Math.round(response.data.uptime)}s`);
        return true;
    } catch (error) {
        console.log(`❌ Server is not running. Please start the server with:`);
        console.log(`   cd server && npm start`);
        console.log(`   Or set PORT environment variable if using a different port`);
        return false;
    }
}

function checkEnvironment() {
    console.log('\n🔧 Checking environment configuration...');
    
    const requiredVars = ['LKEAP_API_KEY'];
    let allSet = true;
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: Configured`);
        } else {
            console.log(`❌ ${varName}: Missing`);
            allSet = false;
        }
    });
    
    if (!allSet) {
        console.log('\n⚠️  Please set the required environment variables in your .env file');
    }
    
    return allSet;
}

async function runAllTests() {
    console.log('🚀 Starting Lkeap API Validation Tests...\n');
    console.log(`Using proxy URL: ${TEST_CONFIG.proxyUrl}`);
    console.log(`Default model: ${TEST_CONFIG.model}`);
    
    // Check environment first
    const envOk = checkEnvironment();
    if (!envOk) {
        console.log('\n❌ Environment not properly configured. Please fix environment variables first.');
        return;
    }
    
    // Check if server is running
    const serverRunning = await checkServerStatus();
    if (!serverRunning) {
        console.log('\n❌ Cannot run tests: Server is not running.');
        return;
    }
    
    console.log(`\n📋 Running ${TEST_CASES.length} test cases...\n`);
    
    // Run each test case
    for (const testCase of TEST_CASES) {
        await runTest(testCase);
        
        // Add a small delay between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / TEST_CASES.length) * 100)}%`);
    
    // Print detailed results
    console.log('\n📋 Detailed Results:');
    testResults.forEach((result, index) => {
        const status = result.passed ? '✅' : '❌';
        console.log(`  ${index + 1}. ${status} ${result.name}`);
        if (result.responseTime) {
            console.log(`     Response time: ${result.responseTime}ms`);
        }
        if (result.error) {
            console.log(`     Error: ${result.error}`);
        }
    });
    
    if (failedTests === 0) {
        console.log('\n🎉 All tests passed! The Lkeap API integration is working correctly.');
    } else {
        console.log(`\n⚠️  ${failedTests} test(s) failed. Please check the above details.`);
    }
}

// Run tests if this script is called directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runTest,
    runAllTests,
    checkServerStatus,
    checkEnvironment,
    TEST_CASES
};