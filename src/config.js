// KIMI API 配置
// 請將你的API密鑰填入下方，或通過環境變量設置
const CONFIG = {
    KIMI_API_KEY: (typeof process !== 'undefined' && process.env && process.env.KIMI_API_KEY) || 'sk-odiSFrUbN0r5jy2oQBntJnkYTcF5sHP2JPppp1Z9EKUIv503',
    KIMI_MODEL: 'moonshot-v1-8k',
    API_BASE_URL: 'https://api.moonshot.cn/v1',
    
    // 生成配置
    GENERATION_CONFIG: {
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95,
    }
};

// 導出配置（適用於模組化環境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全域變數（適用於瀏覽器環境）
if (typeof window !== 'undefined') {
    window.KIMI_CONFIG = CONFIG;
}