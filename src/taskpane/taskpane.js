/* global Office */

// 從配置文件獲取設置
const getConfig = () => {
    return window.KIMI_CONFIG || {
        KIMI_API_KEY: 'YOUR_KIMI_API_KEY_HERE',
        KIMI_MODEL: 'moonshot-v1-8k',
        API_BASE_URL: 'https://api.moonshot.cn/v1'
    };
};

// 檢查是否在Office環境中
console.log('開始初始化插件...');
console.log('Office對象是否存在:', typeof Office !== 'undefined');

if (typeof Office !== 'undefined') {
    console.log('檢測到Office環境，等待Office.onReady...');
    Office.onReady((info) => {
        console.log('Office.onReady觸發，主機類型:', info.host);
        if (info.host === Office.HostType.Outlook) {
            console.log('確認為Outlook環境');
            if (document.readyState === 'loading') {
                document.addEventListener("DOMContentLoaded", function() {
                    console.log('DOM載入完成，初始化應用');
                    initializeApp();
                });
            } else {
                console.log('DOM已載入，直接初始化應用');
                initializeApp();
            }
        } else {
            console.log('非Outlook環境，主機類型:', info.host);
        }
    });
} else {
    console.log('非Office環境，在瀏覽器中運行');
    // 在瀏覽器中直接運行
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", function() {
            console.log('瀏覽器環境DOM載入完成');
            initializeApp();
        });
    } else {
        console.log('瀏覽器環境DOM已載入');
        initializeApp();
    }
}

let currentGeneratedContent = '';

function initializeApp() {
    console.log('初始化應用程序...');
    
    // 檢查配置
    const config = getConfig();
    console.log('配置檢查:', {
        hasApiKey: !!config.KIMI_API_KEY && config.KIMI_API_KEY !== 'YOUR_KIMI_API_KEY_HERE',
        apiKey: config.KIMI_API_KEY ? config.KIMI_API_KEY.substring(0, 10) + '...' : '未設置'
    });
    
    // 綁定事件監聽器
    document.getElementById('generate-email').addEventListener('click', () => setMode('generate'));
    document.getElementById('improve-email').addEventListener('click', () => setMode('improve'));
    document.getElementById('translate-email').addEventListener('click', () => setMode('translate'));
    
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            console.log('生成按鈕被點擊');
            generateContent();
        });
        console.log('生成按鈕事件監聽器已綁定');
    } else {
        console.error('找不到生成按鈕元素');
    }
    document.getElementById('insert-btn').addEventListener('click', insertContent);
    document.getElementById('regenerate-btn').addEventListener('click', generateContent);
    document.getElementById('copy-btn').addEventListener('click', copyContent);
    
    // 設置默認模式
    setMode('generate');
    
    console.log('應用程序初始化完成');
}

function setMode(mode) {
    const promptTextarea = document.getElementById('user-prompt');
    const generateBtn = document.getElementById('generate-btn');
    
    // 更新按鈕狀態
    document.querySelectorAll('.button-group .ms-Button').forEach(btn => {
        btn.classList.remove('ms-Button--primary');
    });
    
    switch(mode) {
        case 'generate':
            document.getElementById('generate-email').classList.add('ms-Button--primary');
            promptTextarea.placeholder = '例如：寫一封感謝客戶的郵件，語氣要正式但友善...';
            generateBtn.querySelector('.ms-Button-label').textContent = '生成郵件';
            break;
        case 'improve':
            document.getElementById('improve-email').classList.add('ms-Button--primary');
            promptTextarea.placeholder = '請描述如何改進當前郵件內容...';
            generateBtn.querySelector('.ms-Button-label').textContent = '優化內容';
            break;
        case 'translate':
            document.getElementById('translate-email').classList.add('ms-Button--primary');
            promptTextarea.placeholder = '請指定要翻譯成什麼語言...';
            generateBtn.querySelector('.ms-Button-label').textContent = '翻譯郵件';
            break;
    }
    
    // 儲存當前模式
    window.currentMode = mode;
}

async function generateContent() {
    console.log('開始生成內容...');
    
    const prompt = document.getElementById('user-prompt').value.trim();
    const tone = document.getElementById('tone-select').value;
    const length = document.getElementById('length-select').value;
    
    console.log('用戶輸入:', { prompt, tone, length, mode: window.currentMode });
    
    if (!prompt) {
        showError('請輸入您的需求描述');
        return;
    }
    
    showLoading(true);
    hideResult();
    
    try {
        let content = '';
        
        if (window.currentMode === 'improve' || window.currentMode === 'translate') {
            console.log('獲取當前郵件內容...');
            const currentContent = await getCurrentEmailContent();
            console.log('當前郵件內容:', currentContent);
            content = await callAIService(prompt, tone, length, window.currentMode, currentContent);
        } else {
            console.log('調用AI服務生成新內容...');
            content = await callAIService(prompt, tone, length, window.currentMode);
        }
        
        console.log('AI生成的內容:', content);
        currentGeneratedContent = content;
        showResult(content);
        
    } catch (error) {
        console.error('生成內容時發生錯誤:', error);
        showError(`生成內容時發生錯誤: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

async function callAIService(prompt, tone, length, mode, currentContent = '') {
    const config = getConfig();
    
    if (!config.KIMI_API_KEY || config.KIMI_API_KEY === 'YOUR_KIMI_API_KEY_HERE') {
        throw new Error('請先在 src/config.js 中設置你的KIMI API密鑰');
    }
    
    try {
        const systemPrompt = buildSystemPrompt(mode, tone, length);
        const userPrompt = buildUserPrompt(prompt, mode, currentContent);
        
        const apiUrl = `${config.API_BASE_URL}/chat/completions`;
        
        const requestBody = {
            model: config.KIMI_MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user", 
                    content: userPrompt
                }
            ],
            temperature: config.GENERATION_CONFIG.temperature || 0.7,
            max_tokens: config.GENERATION_CONFIG.max_tokens || 1024,
            top_p: config.GENERATION_CONFIG.top_p || 0.95
        };
        
        console.log('調用KIMI API:', apiUrl);
        console.log('請求內容:', requestBody);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.KIMI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
                console.error('KIMI API錯誤詳情:', errorData);
            } catch (e) {
                console.error('無法解析錯誤回應:', e);
            }
            throw new Error(`KIMI API錯誤: ${errorMessage}`);
        }
        
        const data = await response.json();
        console.log('KIMI API回應:', data);
        
        // 檢查回應結構
        if (!data.choices || data.choices.length === 0) {
            throw new Error('KIMI API沒有返回任何回應');
        }
        
        const choice = data.choices[0];
        
        if (!choice.message || !choice.message.content) {
            throw new Error('KIMI API返回了無效的內容結構');
        }
        
        return choice.message.content;
        
    } catch (error) {
        console.error('調用KIMI API時發生錯誤:', error);
        
        // 提供更友好的錯誤信息
        if (error.message.includes('401')) {
            throw new Error('API密鑰無效，請檢查您的KIMI API密鑰');
        } else if (error.message.includes('429')) {
            throw new Error('API調用頻率過高，請稍後再試');
        } else if (error.message.includes('NetworkError') || error.name === 'TypeError') {
            throw new Error('網絡連接錯誤，請檢查您的網絡連接');
        }
        
        throw error;
    }
}

function buildSystemPrompt(mode, tone, length) {
    const toneDescriptions = {
        'professional': '專業且正式的商務語氣',
        'friendly': '友善親切但仍保持專業的語氣',
        'formal': '非常正式和禮貌的語氣',
        'casual': '輕鬆自然但適合工作場合的語氣'
    };
    
    const lengthDescriptions = {
        'short': '簡潔明瞭，重點突出',
        'medium': '適中長度，包含必要細節',
        'long': '詳細完整，涵蓋所有相關信息'
    };
    
    let systemPrompt = `你是一個專業的郵件寫作助手。請使用${toneDescriptions[tone]}，內容要${lengthDescriptions[length]}。`;
    
    switch(mode) {
        case 'generate':
            systemPrompt += `
請根據用戶的需求生成一封完整的郵件，包括：
1. 適當的主旨行
2. 合適的稱呼
3. 清晰的郵件正文
4. 專業的結尾和署名
請確保郵件內容專業、清晰且符合商務溝通標準。`;
            break;
            
        case 'improve':
            systemPrompt += `
請優化現有的郵件內容，改進以下方面：
1. 語言表達的清晰度和專業性
2. 邏輯結構和段落組織
3. 語氣的一致性和適當性
4. 整體的可讀性和說服力
保持原意不變，但讓表達更加優雅和有效。`;
            break;
            
        case 'translate':
            systemPrompt += `
請將郵件內容翻譯成指定的語言，注意：
1. 保持原有的語氣和正式程度
2. 確保商務用語的準確性
3. 保留郵件的格式和結構
4. 適應目標語言的文化習慣`;
            break;
    }
    
    return systemPrompt;
}

function buildUserPrompt(prompt, mode, currentContent = '') {
    switch(mode) {
        case 'generate':
            return `請根據以下需求生成一封郵件：\n${prompt}`;
            
        case 'improve':
            return `請優化以下郵件內容：\n\n原始郵件：\n${currentContent}\n\n優化要求：\n${prompt}`;
            
        case 'translate':
            return `請將以下郵件翻譯成${prompt}：\n\n原始郵件：\n${currentContent}`;
            
        default:
            return prompt;
    }
}

async function getCurrentEmailContent() {
    return new Promise((resolve, reject) => {
        if (typeof Office !== 'undefined' && Office.context && Office.context.mailbox) {
            Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    resolve(result.value);
                } else {
                    reject(new Error('無法獲取當前郵件內容'));
                }
            });
        } else {
            // 在瀏覽器中模擬郵件內容
            resolve('這是模擬的郵件內容，用於測試優化和翻譯功能。');
        }
    });
}

async function insertContent() {
    if (!currentGeneratedContent) {
        showError('沒有可插入的內容');
        return;
    }
    
    try {
        if (typeof Office !== 'undefined' && Office.context && Office.context.mailbox) {
            await new Promise((resolve, reject) => {
                Office.context.mailbox.item.body.setAsync(
                    currentGeneratedContent,
                    { coercionType: Office.CoercionType.Text },
                    (result) => {
                        if (result.status === Office.AsyncResultStatus.Succeeded) {
                            resolve();
                        } else {
                            reject(new Error('插入內容失敗'));
                        }
                    }
                );
            });
            showSuccess('內容已成功插入郵件');
        } else {
            // 在瀏覽器中模擬插入功能
            showSuccess('內容已準備好插入（瀏覽器測試模式）');
        }
        
    } catch (error) {
        console.error('插入內容時發生錯誤:', error);
        showError('插入內容時發生錯誤');
    }
}

function copyContent() {
    if (!currentGeneratedContent) {
        showError('沒有可複製的內容');
        return;
    }
    
    navigator.clipboard.writeText(currentGeneratedContent).then(() => {
        showSuccess('內容已複製到剪貼板');
    }).catch(() => {
        showError('複製失敗');
    });
}

function showResult(content) {
    document.getElementById('generated-content').textContent = content;
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('insert-btn').disabled = false;
}

function hideResult() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('insert-btn').disabled = true;
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    // 簡單的錯誤提示，可以改為更好的UI組件
    alert('錯誤: ' + message);
}

function showSuccess(message) {
    // 簡單的成功提示，可以改為更好的UI組件
    alert('成功: ' + message);
}

// 模擬AI回應函數
function generateMockEmail(prompt, tone, length) {
    const toneMap = {
        'professional': '專業',
        'friendly': '友善',
        'formal': '正式',
        'casual': '輕鬆'
    };
    
    const lengthMap = {
        'short': '簡短',
        'medium': '中等長度',
        'long': '詳細'
    };
    
    return `主旨：關於您的詢問

親愛的客戶，

感謝您的來信。根據您的需求「${prompt}」，我們以${toneMap[tone]}的語氣為您準備了這封${lengthMap[length]}的回覆。

我們非常重視您的意見和建議，並會持續改進我們的服務品質。如果您有任何其他問題或需要進一步的協助，請隨時與我們聯繫。

再次感謝您的支持與信任。

此致
敬禮

[您的姓名]
[您的職位]
[公司名稱]

---
註：這是模擬AI生成的內容，用於測試插件功能。`;
}

function improveMockEmail(currentContent, prompt, tone) {
    return `已根據您的要求「${prompt}」優化了郵件內容：

主旨：優化後的郵件主旨

親愛的收件人，

這是經過AI優化的郵件內容，語氣調整為${tone}，內容更加清晰和專業。

原始內容已經過改進，使其更符合商務溝通的標準。

謝謝您的時間。

此致
敬禮

[您的姓名]

---
註：這是模擬AI優化的內容，用於測試插件功能。`;
}

function translateMockEmail(currentContent, prompt) {
    return `翻譯結果（${prompt}）：

Subject: Translated Email Subject

Dear Recipient,

This is the translated version of your email content. The translation maintains the original tone and meaning while adapting to the target language.

Thank you for your time.

Best regards,
[Your Name]

---
Note: This is a simulated AI translation for testing plugin functionality.`;
}