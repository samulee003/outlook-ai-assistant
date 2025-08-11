# KIMI API 設置指南

## 🚀 快速開始

### 1. 獲取KIMI API密鑰

1. 前往 [Moonshot AI 開放平台](https://platform.moonshot.cn/)
2. 註冊並登入您的帳戶
3. 前往 "API Keys" 頁面
4. 點擊 "創建新的API Key"
5. 複製生成的API密鑰

### 2. 配置插件

1. 打開項目中的 `src/config.js` 文件
2. 找到以下行：
   ```javascript
   KIMI_API_KEY: 'YOUR_KIMI_API_KEY_HERE',
   ```
3. 將 `YOUR_KIMI_API_KEY_HERE` 替換為您的實際API密鑰：
   ```javascript
   KIMI_API_KEY: 'sk-your-actual-api-key-here',
   ```

### 3. 測試設置

1. 刷新瀏覽器頁面：`http://localhost:3000/test.html`
2. 輸入測試內容："寫一封感謝客戶的郵件"
3. 點擊生成內容
4. 查看是否成功生成AI內容

## 📋 KIMI API 特點

- **中文優化**: 對中文內容理解和生成效果更好
- **地區支援**: 在中國大陸地區可正常使用
- **成本效益**: 相對較低的API調用成本
- **穩定性**: 服務穩定，響應速度快

## 🔧 可用模型

- `moonshot-v1-8k`: 8K上下文長度，適合一般郵件生成
- `moonshot-v1-32k`: 32K上下文長度，適合長文檔處理
- `moonshot-v1-128k`: 128K上下文長度，適合超長內容

## 💰 定價信息

請查看 [Moonshot AI 定價頁面](https://platform.moonshot.cn/pricing) 了解最新的定價信息。

## 🛠️ 故障排除

### 常見錯誤

1. **401 Unauthorized**
   - 檢查API密鑰是否正確
   - 確認API密鑰是否已啟用

2. **429 Too Many Requests**
   - 降低請求頻率
   - 檢查API配額使用情況

3. **網絡連接錯誤**
   - 檢查網絡連接
   - 確認防火牆設置

### 調試步驟

1. 打開瀏覽器開發者工具
2. 查看Console標籤的錯誤信息
3. 檢查Network標籤的API請求狀態
4. 確認請求和回應的格式

## 📞 技術支援

如有問題，可以：
- 查看 [Moonshot AI 文檔](https://platform.moonshot.cn/docs)
- 聯繫 Moonshot AI 技術支援
- 在項目中提交Issue