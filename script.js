// 测试问题数据
const questions = {
    short: [
        {
            "text": "在社交场合中，你通常更倾向于主动与人交谈",
            "dimension": "E/I",
            "direction": 1
        },
        {
            "text": "你更喜欢通过实践来学习新事物",
            "dimension": "S/N",
            "direction": -1
        },
        {
            "text": "做决定时，你更依赖逻辑而非个人感受",
            "dimension": "T/F",
            "direction": 1
        },
        {
            "text": "你更喜欢有计划的生活而不是随性而为",
            "dimension": "J/P",
            "direction": 1
        },
        {
            "text": "你经常思考人生的意义和可能性",
            "dimension": "S/N",
            "direction": 1
        },
        {
            "text": "你更注重事实细节而非整体概念",
            "dimension": "S/N",
            "direction": -1
        },
        {
            "text": "你倾向于同情他人而非客观分析",
            "dimension": "T/F",
            "direction": -1
        },
        {
            "text": "你更喜欢灵活应对变化而非按计划行事",
            "dimension": "J/P",
            "direction": -1
        }
    ],
    standard: [
        {
            "text": "在聚会中，你通常喜欢和不同的人交流",
            "dimension": "E/I",
            "direction": 1
        },
        {
            "text": "独处一段时间后你会感到精力充沛",
            "dimension": "E/I",
            "direction": -1
        },
        {
            "text": "你更关注现实而非未来的可能性",
            "dimension": "S/N",
            "direction": -1
        },
        {
            "text": "你喜欢讨论抽象概念和理论",
            "dimension": "S/N",
            "direction": 1
        },
        {
            "text": "做决定时你首先考虑的是逻辑正确性",
            "dimension": "T/F",
            "direction": 1
        },
        {
            "text": "你经常考虑决定对他人情感的影响",
            "dimension": "T/F",
            "direction": -1
        },
        {
            "text": "你喜欢事先制定详细的计划",
            "dimension": "J/P",
            "direction": 1
        },
        {
            "text": "你更喜欢灵活应对变化而非按计划行事",
            "dimension": "J/P",
            "direction": -1
        },
        {
            "text": "在团队中你通常主动发言",
            "dimension": "E/I",
            "direction": 1
        },
        {
            "text": "你更喜欢具体的事实而非抽象的理论",
            "dimension": "S/N",
            "direction": -1
        },
        // 更多标准测试问题...
        {
            "text": "你通常会提前规划好自己的一天",
            "dimension": "J/P",
            "direction": 1
        },
        {
            "text": "你更擅长处理具体的任务而非抽象的想法",
            "dimension": "S/N",
            "direction": -1
        }
    ],
    extended: [
        {
            "text": "你经常是聚会中的焦点人物",
            "dimension": "E/I",
            "direction": 1
        },
        {
            "text": "你倾向于通过独处来恢复精力",
            "dimension": "E/I",
            "direction": -1
        },
        // 更多扩展测试问题...
        {
            "text": "你在做决策时，会详细考虑各种可能性",
            "dimension": "J/P",
            "direction": 1
        },
        {
            "text": "你对周围环境的细节变化非常敏感",
            "dimension": "S/N",
            "direction": -1
        }
    ]
};

// 当前测试状态
let currentTest = {
    mode: null,
    answers: [],
    currentQuestion: 0,
    dimensions: {
        'E/I': { E: 0, I: 0 },
        'S/N': { S: 0, N: 0 },
        'T/F': { T: 0, F: 0 },
        'J/P': { J: 0, P: 0 }
    }
};

// DOM元素
const domElements = {
    shortTestBtn: null,
    standardTestBtn: null,
    extendedTestBtn: null,
    testArea: null,
    questionElement: null,
    prevQuestionBtn: null,
    nextQuestionBtn: null,
    progressElement: null,
    resultArea: null,
    mbtiTypeElement: null,
    aiAnalysisElement: null
};

// 初始化DOM元素
function initDOMElements() {
    domElements.shortTestBtn = document.getElementById('shortTest');
    domElements.standardTestBtn = document.getElementById('standardTest');
    domElements.extendedTestBtn = document.getElementById('extendedTest');
    domElements.testArea = document.getElementById('testArea');
    domElements.questionElement = document.getElementById('question');
    domElements.prevQuestionBtn = document.getElementById('prevQuestion');
    domElements.nextQuestionBtn = document.getElementById('nextQuestion');
    domElements.progressElement = document.getElementById('progress');
    domElements.resultArea = document.getElementById('resultArea');
    domElements.mbtiTypeElement = document.getElementById('mbtiType');
    domElements.aiAnalysisElement = document.getElementById('aiAnalysis');
}

// 初始化事件监听
function initEventListeners() {
    domElements.shortTestBtn.addEventListener('click', () => startTest('short'));
    domElements.standardTestBtn.addEventListener('click', () => startTest('standard'));
    domElements.extendedTestBtn.addEventListener('click', () => startTest('extended'));
    domElements.prevQuestionBtn.addEventListener('click', showPreviousQuestion);
    domElements.nextQuestionBtn.addEventListener('click', showNextQuestion);
}

// 开始测试
function startTest(mode) {
    try {
        if (!questions[mode]) {
            console.error(`Invalid test mode: ${mode}`);
            return;
        }

        currentTest = {
            mode: mode,
            answers: new Array(questions[mode].length).fill(null),
            currentQuestion: 0,
            dimensions: {
                'E/I': { E: 0, I: 0 },
                'S/N': { S: 0, N: 0 },
                'T/F': { T: 0, F: 0 },
                'J/P': { J: 0, P: 0 }
            }
        };

        document.querySelector('.mode-selection').classList.add('hidden');
        domElements.testArea.classList.remove('hidden');
        showQuestion();
    } catch (error) {
        console.error('Error starting test:', error);
        if (domElements.testArea) {
            domElements.testArea.classList.add('hidden');
        }
        document.querySelector('.mode-selection').classList.remove('hidden');
    }
}

// 显示当前问题
function showQuestion() {
    try {
        const question = questions[currentTest.mode][currentTest.currentQuestion];
        if (!question) {
            console.error(`Question at index ${currentTest.currentQuestion} does not exist in ${currentTest.mode} mode`);
            return;
        }
        
        // 更新问题编号属性
        domElements.questionElement.setAttribute('data-question-number', `第 ${currentTest.currentQuestion + 1} 题`);
        domElements.questionElement.innerHTML = question.text;

        // 恢复之前的选择
        if (currentTest.answers[currentTest.currentQuestion]!== null) {
            const selectedRadio = document.querySelector(`input[value="${currentTest.answers[currentTest.currentQuestion]}"]`);
            if (selectedRadio) {
                selectedRadio.checked = true;
            }
        }

        updateProgress();
        
        // 添加动画效果
        domElements.questionElement.style.animation = 'none';
        setTimeout(() => {
            domElements.questionElement.style.animation = 'fadeInUp 0.5s ease-out';
        }, 10);
        
    } catch (error) {
        console.error('Error showing question:', error);
        domElements.questionElement.innerHTML = '加载问题时出现错误，请稍后重试。';
    }
}

// 更新进度显示
function updateProgress() {
    try {
        const total = questions[currentTest.mode] ? questions[currentTest.mode].length : 0;
        if (total === 0) {
            console.error(`No questions found for mode: ${currentTest.mode}`);
            return;
        }

        domElements.progressElement.textContent = `${currentTest.currentQuestion + 1}/${total}`;

        // 控制按钮状态
        domElements.prevQuestionBtn.disabled = currentTest.currentQuestion === 0;
        domElements.nextQuestionBtn.textContent = currentTest.currentQuestion === total - 1? '查看结果' : '下一题';
    } catch (error) {
        console.error('Error updating progress:', error);
        domElements.progressElement.textContent = '0/0';
    }
}

// 显示上一题
function showPreviousQuestion() {
    try {
        saveAnswer();
        currentTest.currentQuestion--;
        if (currentTest.currentQuestion < 0) {
            currentTest.currentQuestion = 0; // 防止索引越界
        }
        showQuestion();
    } catch (error) {
        console.error('Error showing previous question:', error);
        currentTest.currentQuestion = Math.max(0, currentTest.currentQuestion + 1); // Revert to safe position
    }
}

// 显示下一题
function showNextQuestion() {
    try {
        saveAnswer();

        if (currentTest.currentQuestion < questions[currentTest.mode].length - 1) {
            currentTest.currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    } catch (error) {
        console.error('Error showing next question:', error);
        if (currentTest.currentQuestion > 0) {
            currentTest.currentQuestion--; // Revert to safe position
        }
    }
}

// 保存当前答案
function saveAnswer() {
    try {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (selected) {
            const value = parseInt(selected.value);
            if (!isNaN(value) && value >= 1 && value <= 5) {
                currentTest.answers[currentTest.currentQuestion] = value;
            } else {
                console.warn(`Invalid answer value: ${selected.value}`);
            }
        }
    } catch (error) {
        console.error('Error saving answer:', error);
    }
}

// 显示测试结果
function showResults() {
    try {
        domElements.testArea.classList.add('hidden');
        domElements.resultArea.classList.remove('hidden');

        // 计算MBTI结果
        const result = calculateMBTI();
        if (result && result.length === 4) {
            // 添加成功动画
            domElements.mbtiTypeElement.innerHTML = `
                <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                你的MBTI类型是: ${result}
            `;
        } else {
            domElements.mbtiTypeElement.textContent = '计算结果时出现错误，请重试。';
        }

        // 调用腾讯云AI分析（暂模拟）
        analyzeWithAI(result);
    } catch (error) {
        console.error('Error showing results:', error);
        domElements.mbtiTypeElement.textContent = '处理结果时出现错误，请重试。';
    }
}

// 计算MBTI类型
function calculateMBTI() {
    try {
        // 重置维度分数
        currentTest.dimensions = {
            'E/I': { E: 0, I: 0 },
            'S/N': { S: 0, N: 0 },
            'T/F': { T: 0, F: 0 },
            'J/P': { J: 0, P: 0 }
        };

        // 验证 answers array
        if (!currentTest.answers || !Array.isArray(currentTest.answers)) {
            console.error('Invalid answers array');
            return '未知';
        }

        // 根据答案计算各维度分数
        currentTest.answers.forEach((answer, index) => {
            if (answer !== null && answer !== undefined && questions[currentTest.mode] && questions[currentTest.mode][index]) {
                const question = questions[currentTest.mode][index];
                const dimension = question.dimension;
                const direction = question.direction;

                if (!dimension || !direction) {
                    console.warn(`Missing dimension or direction for question at index ${index}`);
                    return;
                }

                // 根据问题方向和答案更新分数
                const [type1, type2] = dimension.split('/');
                if (!type1 || !type2) {
                    console.warn(`Invalid dimension format: ${dimension}`);
                    return;
                }

                if (typeof answer !== 'number' || answer < 1 || answer > 5) {
                    console.warn(`Invalid answer value: ${answer} at index ${index}`);
                    return;
                }

                if (direction > 0) {
                    currentTest.dimensions[dimension][type1] += answer;
                    currentTest.dimensions[dimension][type2] += (6 - answer); // 反向计分
                } else {
                    currentTest.dimensions[dimension][type1] += (6 - answer);
                    currentTest.dimensions[dimension][type2] += answer;
                }
            }
        });

        // 确定类型
        let type = '';
        for (const dimension in currentTest.dimensions) {
            const [type1, type2] = dimension.split('/');
            if (currentTest.dimensions[dimension][type1] > currentTest.dimensions[dimension][type2]) {
                type += type1;
            } else {
                type += type2;
            }
        }

        // 验证结果格式
        if (type.length !== 4) {
            console.warn(`Invalid MBTI type result: ${type}`);
            return '未知';
        }

        return type;
    } catch (error) {
        console.error('Error calculating MBTI:', error);
        return '未知';
    }
}

// 使用AI分析结果
async function analyzeWithAI(mbtiType) {
    try {
        if (!mbtiType || mbtiType === '未知') {
            domElements.aiAnalysisElement.innerHTML = `
                <h3>分析结果</h3>
                <p>无法生成分析结果，请重新测试。</p>
            `;
            return;
        }

        domElements.aiAnalysisElement.innerHTML = `
            <h3>AI分析结果</h3>
            <div class="ai-analysis-content">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="loading"></div>
                    <span>正在调用AI分析你的测试结果...</span>
                </div>
            </div>
        `;

        // 构建发送到后端API的请求
        const apiRequest = {
            model: "deepseek-v3-0324",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的心理学分析师，专门分析MBTI性格类型。请根据用户的MBTI类型提供详细、准确、有见地的性格分析，包括优势、劣势、适合的职业方向、人际关系建议等。回答请用中文，语气专业但友好。"
                },
                {
                    role: "user",
                    content: `我的MBTI类型是${mbtiType}，请为我提供详细的性格分析和建议。`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        };

        // 调用后端代理API
        const apiUrl = API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.LKEAP);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequest)
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // 提取AI分析结果
        let aiAnalysis = "抱歉，未能获得有效的AI分析结果。";
        if (result.choices && result.choices.length > 0 && result.choices[0].message) {
            aiAnalysis = result.choices[0].message.content;
        }

        // 显示AI分析结果
        domElements.aiAnalysisElement.innerHTML = `
            <h3>AI分析结果</h3>
            <div class="ai-analysis-content">${aiAnalysis}</div>
        `;
        
    } catch (error) {
        console.error('Error calling AI analysis API:', error);

        // 如果API调用失败，回退到模拟数据
        console.log('Falling back to mock analysis due to API error');
        const mockAnalysis = getMockAIAnalysis(mbtiType);
        
        domElements.aiAnalysisElement.innerHTML = `
            <h3>分析结果</h3>
            <div class="ai-analysis-content">
                <p><strong>AI分析服务暂时不可用：</strong>${error.message || '未知错误'}</p>
                <p><strong>模拟分析结果：</strong></p>
                <p>${mockAnalysis}</p>
            </div>
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                💡 提示：请确保后端API服务正在运行，或检查网络连接。
            </p>
        `;
    }
}

// Mock AI analysis function
function getMockAIAnalysis(mbtiType) {
    const analyses = {
        'INTJ': '根据你的MBTI类型INTJ，AI分析显示你是一个具有战略思维的人。你善于规划长远目标，逻辑思维强，喜欢独立工作。你倾向于追求完美，对自己和他人都有较高的标准。',
        'INTP': '根据你的MBTI类型INTP，AI分析显示你是一个富有创造力和好奇心的人。你喜欢探索新想法和概念，善于分析复杂问题。你享受独处的时间，通过思考来理解世界。',
        'ENTJ': '根据你的MBTI类型ENTJ，AI分析显示你是一个天生的领导者。你具有强烈的组织能力和决策能力，善于制定计划并执行。你喜欢挑战，总是寻求改进和效率。',
        'ENTP': '根据你的MBTI类型ENTP，AI分析显示你是一个充满创新思维的人。你喜欢头脑风暴和探索各种可能性，善于从不同角度看待问题。你适应性强，喜欢变化和多样性。',
        'INFJ': '根据你的MBTI类型INFJ，AI分析显示你是一个富有洞察力和同情心的人。你善于理解他人的情感和需求，具有强烈的价值观。你追求意义和目标，希望为世界带来积极影响。',
        'INFP': '根据你的MBTI类型INFP，AI分析显示你是一个理想主义者和价值驱动的人。你重视真实性和个人成长，具有强烈的道德感。你富有创造力，通过艺术或写作来表达自己。',
        'ENFJ': '根据你的MBTI类型ENFJ，AI分析显示你是一个富有魅力和同情心的人。你善于理解和支持他人，具有强烈的责任感。你享受帮助他人成长和发展，是天生的导师。',
        'ENFP': '根据你的MBTI类型ENFP，AI分析显示你是一个充满热情和创造力的人。你善于发现新的可能性，喜欢与他人分享想法。你适应性强，总是寻求新的体验和冒险。',
        'ISTJ': '根据你的MBTI类型ISTJ，AI分析显示你是一个可靠和负责任的人。你重视传统和秩序，喜欢按照既定的规则和程序工作。你注重细节，是团队中的稳定力量。',
        'ISFJ': '根据你的MBTI类型ISFJ，AI分析显示你是一个关怀支持和他人的人。你重视和谐和稳定，善于创造舒适的环境。你忠诚可靠，总是愿意帮助他人。',
        'ESTJ': '根据你的MBTI类型ESTJ，AI分析显示你是一个务实和高效的人。你善于组织和管理，喜欢制定清晰的计划和目标。你重视效率和结果，是优秀的执行者。',
        'ESFJ': '根据你的MBTI类型ESFJ，AI分析显示你是一个友好和合群的人。你重视人际关系和和谐，善于照顾他人的需求。你是团队中的粘合剂，总是寻求共识和合作。',
        'ISTP': '根据你的MBTI类型ISTP，AI分析显示你是一个实用和适应性强的人。你善于解决问题和处理危机，喜欢动手操作。你独立自主，喜欢按照自己的节奏工作。',
        'ISFP': '根据你的MBTI类型ISFP，AI分析显示你是一个温和和艺术性的人。你重视美感和和谐，喜欢通过创造性的方式表达自己。你灵活适应，享受当下的体验。',
        'ESTP': '根据你的MBTI类型ESTP，AI分析显示你是一个充满活力和冒险精神的人。你喜欢行动和刺激，善于抓住机会。你现实务实，总是寻求新的体验和挑战。',
        'ESFP': '根据你的MBTI类型ESFP，AI分析显示你是一个热情和乐观的人。你享受生活和与他人互动，善于创造愉快的氛围。你灵活适应，总是寻求乐趣和新的体验。'
    };
    
    return analyses[mbtiType] || `根据你的MBTI类型${mbtiType}，AI分析显示你是一个独特而有趣的个体。每个人都自己独特的性格特征，这些特征共同构成了你独特的个性。继续探索和发展你的优势！`;
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        initDOMElements();
        initEventListeners();
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('应用程序初始化失败，请刷新页面重试。');
    }
});