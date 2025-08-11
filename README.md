# Outlook AI郵件助手插件

這是一個為Microsoft Outlook開發的AI郵件協助撰寫插件，可以幫助用戶快速生成、優化和翻譯郵件內容。

## 功能特色

- **智能生成郵件**: 根據用戶描述自動生成專業郵件內容
- **內容優化**: 改進現有郵件的語氣、結構和表達
- **多語言翻譯**: 將郵件翻譯成不同語言
- **語氣調整**: 支持專業、友善、正式、輕鬆等多種語氣
- **長度控制**: 可選擇簡短、中等或詳細的內容長度

## 安裝和開發

### 前置需求

- Node.js (版本 14 或更高)
- Microsoft Outlook (桌面版或網頁版)
- 有效的Microsoft 365帳戶

### 安裝步驟

1. 克隆或下載此項目
2. 安裝依賴項：
   ```bash
   npm install
   ```

3. 啟動開發服務器：
   ```bash
   npm start
   ```

4. 在Outlook中載入插件：
   - 打開Outlook
   - 前往 "取得增益集" 或 "管理增益集"
   - 選擇 "我的增益集" > "新增自訂增益集" > "從檔案新增"
   - 選擇 `manifest.xml` 文件

### 開發說明

#### 項目結構

```
outlook-ai-assistant/
├── manifest.xml          # Office插件清單文件
├── src/
│   ├── config.js         # Gemini API配置文件
│   ├── taskpane/         # 任務窗格相關文件
│   │   ├── taskpane.html # 用戶界面
│   │   ├── taskpane.js   # 主要邏輯（含Gemini API整合）
│   │   └── taskpane.css  # 樣式文件
│   └── commands/         # 命令處理
│       ├── commands.html # 命令頁面
│       └── commands.js   # 功能命令
├── package.json          # 項目配置
└── README.md            # 說明文檔
```

#### 核心功能

1. **郵件生成** (`generateContent()`): 
   - 接收用戶輸入的需求描述
   - 調用AI服務生成郵件內容
   - 支持不同語氣和長度設置

2. **內容優化** (`improveMockEmail()`):
   - 讀取當前郵件內容
   - 根據用戶要求進行優化
   - 保持原有意思的同時改進表達

3. **郵件翻譯** (`translateMockEmail()`):
   - 獲取當前郵件內容
   - 翻譯成指定語言
   - 保持格式和語氣

#### Gemini API 設置

本插件已整合Google Gemini Flash API。請按照以下步驟設置：

1. **獲取API密鑰**：
   - 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 登入您的Google帳戶
   - 點擊 "Create API Key" 創建新的API密鑰
   - 複製生成的API密鑰

2. **配置API密鑰**：
   - 打開 `src/config.js` 文件
   - 將 `YOUR_GEMINI_API_KEY_HERE` 替換為您的實際API密鑰：
   ```javascript
   const CONFIG = {
       GEMINI_API_KEY: 'your-actual-api-key-here',
       // ... 其他配置
   };
   ```

3. **API配置選項**：
   ```javascript
   // 在 src/config.js 中可以調整以下設置
   GENERATION_CONFIG: {
       temperature: 0.7,        // 創造性程度 (0.0-1.0)
       topK: 40,               // 候選詞數量
       topP: 0.95,             // 累積機率閾值
       maxOutputTokens: 1024,   // 最大輸出長度
   }
   ```

#### API功能特色

- **智能提示工程**: 針對不同模式（生成、優化、翻譯）使用專門的系統提示
- **語氣控制**: 支持專業、友善、正式、輕鬆四種語氣
- **長度調節**: 可生成簡短、中等或詳細的內容
- **安全過濾**: 內建內容安全檢查機制
- **錯誤處理**: 完善的錯誤處理和用戶友好的錯誤信息

#### 支援的功能模式

1. **郵件生成模式**: 根據需求描述生成完整郵件
2. **內容優化模式**: 改進現有郵件的表達和結構
3. **翻譯模式**: 將郵件翻譯成指定語言

### 部署

1. **開發環境**: 使用 `npm start` 在本地運行
2. **生產環境**: 將文件部署到HTTPS服務器，並更新manifest.xml中的URL

### 安全考慮

- 確保所有API調用都使用HTTPS
- 妥善保管API密鑰
- 實施適當的錯誤處理
- 遵循Microsoft Office插件的安全最佳實踐

## 使用方法

1. 在Outlook中撰寫新郵件
2. 點擊功能區中的"AI助手"按鈕
3. 選擇所需功能（生成、優化或翻譯）
4. 輸入需求描述
5. 選擇語氣和長度設置
6. 點擊生成按鈕
7. 查看結果並插入到郵件中

## 故障排除

### 常見問題

1. **插件無法載入**
   - 檢查manifest.xml文件格式
   - 確認服務器正在運行
   - 驗證URL是否正確

2. **Gemini API相關問題**
   - **API密鑰錯誤**: 確認在 `src/config.js` 中正確設置了API密鑰
   - **配額超限**: 檢查您的Google Cloud配額使用情況
   - **網絡連接**: 確認可以訪問 `generativelanguage.googleapis.com`
   - **內容被過濾**: 嘗試修改請求內容，避免觸發安全過濾器

3. **內容生成問題**
   - **生成失敗**: 查看瀏覽器控制台的詳細錯誤信息
   - **回應格式錯誤**: 確認使用的是正確的Gemini API版本
   - **請求超時**: 檢查網絡連接或嘗試縮短請求內容

4. **內容無法插入**
   - 確認Outlook權限設置
   - 檢查郵件是否處於編輯模式
   - 驗證Office.js API是否正確載入

### 調試技巧

1. **開啟瀏覽器開發者工具**查看控制台錯誤
2. **檢查網絡請求**確認API調用是否成功
3. **測試API密鑰**可以直接在Google AI Studio中測試
4. **查看API配額**在Google Cloud Console中監控使用情況

## 貢獻

歡迎提交問題報告和功能請求。如果您想貢獻代碼，請：

1. Fork此項目
2. 創建功能分支
3. 提交更改
4. 發起Pull Request

## 授權

此項目採用MIT授權條款。詳見LICENSE文件。

## 聯繫方式

如有問題或建議，請通過以下方式聯繫：
- 電子郵件: [your-email]
- GitHub Issues: [project-url]

---

**注意**: 這是一個示例項目，實際使用時需要整合真實的AI服務API。