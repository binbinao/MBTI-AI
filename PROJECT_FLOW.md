# 项目流程图和时序图

## 项目概述

该项目包含两个主要组件：
1. **AlexNet模型**：一个预训练的深度学习模型
2. **MBTI性格测试**：一个集成了腾讯云AI的Web应用，用于进行人格分析

我们重点关注MBTI性格测试组件的工作流程。

## 流程图

```mermaid
graph TD
    A[用户访问index.html] --> B[加载HTML界面]
    B --> C[加载script.js和styles.css]
    C --> D[初始化DOM元素和事件监听器]
    D --> E[显示测试模式选择界面]
    E --> F{用户选择测试模式}
    F -->|短测试| G[开始8题测试]
    F -->|标准测试| H[开始28题测试]
    F -->|扩展测试| I[开始100+题测试]
    G --> J[显示题目和答题选项]
    H --> J
    I --> J
    J --> K{用户操作}
    K -->|下一题| L[保存答案并显示下一题]
    K -->|上一题| M[返回上一题]
    K -->|完成测试| N[计算MBTI类型]
    L --> J
    M --> J
    N --> O[调用腾讯云AI服务分析]
    O --> P[显示AI分析结果]
    P --> Q[结束]
```

## 时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant S as 服务端(API代理)
    participant T as 腾讯云AI
    
    U->>B: 访问index.html
    B->>B: 加载页面资源(script.js, styles.css等)
    B->>U: 显示测试模式选择界面
    
    U->>B: 选择测试模式(短/标准/扩展)
    B->>B: 初始化测试状态和题目
    B->>U: 显示第一题
    
    loop 答题过程
        U->>B: 选择答案并点击下一题
        B->>B: 保存当前答案
        B->>U: 显示下一题
    end
    
    U->>B: 完成所有题目
    B->>B: 计算MBTI类型
    B->>U: 显示计算结果
    
    B->>S: 发送AI分析请求(/api/tencent-ai)
    S->>S: 验证请求参数和凭证
    S->>T: 调用腾讯云API(实际代码中有mock实现)
    T-->>S: 返回AI分析结果
    S-->>B: 返回分析结果
    B->>U: 显示AI分析结果
```

## 组件架构图

```mermaid
graph TB
    subgraph 前端层
        A[index.html] --> B[script.js]
        B --> C[styles.css]
        B --> D[TencentAIService]
        D --> E[APIConfig]
    end
    
    subgraph 后端层
        F[API代理服务器]
        F --> G[Express.js]
        G --> H[Tencent Cloud SDK/Axios]
    end
    
    subgraph 腾讯云服务
        I[Tencent Cloud AI API]
    end
    
    subgraph 数据存储
        J[.env配置文件]
        K[问题数据集]
    end
    
    B -.->|HTTP请求| F
    F -.->|API调用| I
    E -.->|读取配置| J
    B -->|使用| K
```

## 关键模块说明

### 1. 前端模块 (script.js)
- **测试管理**: 处理不同模式的测试流程
- **用户交互**: 管理题目展示、答案收集和导航
- **结果计算**: 根据用户答案计算MBTI类型
- **AI集成**: 调用TencentAIService进行AI分析

### 2. AI服务模块 (tencent-ai-service.js)
- **配置管理**: 处理API密钥和端点配置
- **API调用**: 实现与后端代理的安全通信
- **错误处理**: 提供降级方案(mock响应)

### 3. 后端代理 (api-proxy.js)
- **安全代理**: 在服务器端处理敏感凭证
- **请求转发**: 将前端请求转发至腾讯云API
- **响应处理**: 处理并返回API响应

### 4. 配置管理 (api-config.js)
- **环境配置**: 管理不同环境下的API设置
- **默认值**: 提供合理的默认配置

这个项目采用了前后端分离的架构设计，通过后端代理来保护API密钥的安全性，并提供了完整的MBTI测试流程和AI分析功能。