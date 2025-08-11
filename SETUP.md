# Gemini API 設置指南

## 快速開始

### 1. 獲取Gemini API密鑰

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用您的Google帳戶登入
3. 點擊 "Create API Key" 按鈕
4. 選擇一個Google Cloud項目（或創建新項目）
5. 複製生成的API密鑰

### 2. 配置插件

1. 打開項目中的 `src/config.js` 文件
2. 找到以下行：
   ```javascript
   GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
   ```
3. 將 `YOUR_GEMINI_API_KEY_HERE` 替換為您的實際API密鑰：
   ```javascript
   GEMINI_API_KEY: 'AIzaSyC-your-actual-api-key-here',
   ```

### 3. 測試設置

1. 啟動開發服務器：
   ```bash
   npm start
   ```
2. 在Outlook中載入插件
3. 嘗試生成一封測試郵件

## 進階配置

### 調整生成參數

在 `src/config.js` 中，您可以調整以下參數來優化AI生成效果：

```javascript
GENERATION_CONFIG: {
    temperature: 0.7,        // 創造性 (0.0-1.0)
                            // 0.0 = 更保守、一致
                            // 1.0 = 更創新、多樣
    
    topK: 40,               // 候選詞數量 (1-40)
                            // 較小值 = 更聚焦
                            // 較大值 = 更多樣
    
    topP: 0.95,             // 累積機率 (0.0-1.0)
                            // 控制詞彙選擇的多樣性
    
    maxOutputTokens: 1024,   // 最大輸出長度
                            // 根據需要調整
}
```

### 安全設置

插件包含內建的安全過濾器設置：

```javascript
SAFETY_SETTINGS: [
    {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    // ... 其他安全類別
]
```

可用的閾值選項：
- `BLOCK_NONE`: 不阻擋
- `BLOCK_ONLY_HIGH`: 只阻擋高風險內容
- `BLOCK_MEDIUM_AND_ABOVE`: 阻擋中等及以上風險內容
- `BLOCK_LOW_AND_ABOVE`: 阻擋低等及以上風險內容

## 成本考量

### 免費配額

Google Gemini API提供慷慨的免費配額：
- 每分鐘15個請求
- 每天1,500個請求
- 每分鐘100萬個token

### 監控使用量

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇您的項目
3. 導航到 "APIs & Services" > "Quotas"
4. 搜索 "Generative Language API"

### 優化使用

- 使用適當的 `maxOutputTokens` 設置
- 避免過於頻繁的API調用
- 考慮實施客戶端快取機制

## 故障排除

### 常見錯誤代碼

| 錯誤代碼 | 說明 | 解決方案 |
|---------|------|----------|
| 400 | 請求格式錯誤 | 檢查請求參數格式 |
| 401 | API密鑰無效 | 驗證API密鑰是否正確 |
| 403 | 權限不足 | 確認API已啟用且有足夠權限 |
| 429 | 配額超限 | 等待配額重置或升級計劃 |
| 500 | 服務器錯誤 | 稍後重試 |

### 調試步驟

1. **檢查API密鑰**：
   ```javascript
   console.log('API Key:', config.GEMINI_API_KEY.substring(0, 10) + '...');
   ```

2. **測試API連接**：
   在瀏覽器控制台中直接測試API調用

3. **查看詳細錯誤**：
   開啟瀏覽器開發者工具的Network標籤

## 安全最佳實踐

1. **保護API密鑰**：
   - 不要將API密鑰提交到版本控制系統
   - 考慮使用環境變量
   - 定期輪換API密鑰

2. **實施速率限制**：
   - 在客戶端實施請求節流
   - 避免同時發送多個請求

3. **內容驗證**：
   - 驗證用戶輸入
   - 實施適當的內容過濾

## 支援資源

- [Gemini API 文檔](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API 定價資訊](https://ai.google.dev/pricing)