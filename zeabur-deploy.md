# Zeabur 部署指南

## 🚀 推薦方法：直接文件上傳

### 步驟1：準備文件
需要上傳的核心文件：
```
outlook-ai-assistant/
├── app.js                 # 主服務器文件
├── package.json           # 項目配置
├── Dockerfile            # 容器配置
├── src/                  # 插件源代碼
│   ├── config.js         # API配置
│   ├── taskpane/         # 插件界面
│   └── commands/         # 插件命令
├── test.html             # 測試頁面
└── manifest.xml          # Outlook插件清單
```

### 步驟2：在Zeabur中部署
1. 前往 [Zeabur](https://zeabur.com/)
2. 點擊 "New Project"
3. 選擇 **"Upload Files"** 或 **"Drag & Drop"**
4. 將項目文件夾拖拽到Zeabur
5. Zeabur會自動檢測Node.js項目

### 步驟3：設置環境變數
在Zeabur控制台中添加：
- **變數名**: `KIMI_API_KEY`
- **值**: `sk-odiSFrUbN0r5jy2oQBntJnkYTcF5sHP2JPppp1Z9EKUIv503`

### 步驟4：獲取HTTPS URL
部署完成後，Zeabur會提供HTTPS URL，格式類似：
- `https://your-app-name.zeabur.app`

## 🔄 如果Git方法還是有問題

可以嘗試：
1. 創建新的GitHub倉庫
2. 或者使用Zeabur的文件上傳功能
3. 或者嘗試其他Git平台（GitLab, Gitee）

## ✅ 部署成功後
1. 測試 `https://your-url.zeabur.app/test.html`
2. 更新manifest.xml中的URL
3. 在Outlook中載入插件