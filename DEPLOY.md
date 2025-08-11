# Zeabur 部署指南

## 🚀 部署步驟

### 1. 準備Git倉庫

```bash
git init
git add .
git commit -m "Initial commit: Outlook AI Assistant"
```

### 2. 推送到GitHub（可選）

如果你有GitHub帳戶：
```bash
git remote add origin https://github.com/your-username/outlook-ai-assistant.git
git push -u origin main
```

### 3. 部署到Zeabur

1. 前往 [Zeabur](https://zeabur.com/)
2. 登入你的帳戶
3. 點擊 "New Project"
4. 選擇 "Deploy from Git" 或直接上傳文件
5. 選擇這個項目
6. Zeabur會自動檢測到Node.js項目並開始部署

### 4. 獲取HTTPS URL

部署完成後，Zeabur會提供一個HTTPS URL，例如：
`https://your-app-name.zeabur.app`

### 5. 更新manifest.xml

將manifest.xml中的URL更新為Zeabur提供的HTTPS URL：

```xml
<SourceLocation DefaultValue="https://your-app-name.zeabur.app/src/taskpane/taskpane.html"/>
```

## 🔧 環境變數設置

在Zeabur控制台中設置以下環境變數：

- `KIMI_API_KEY`: 你的KIMI API密鑰
- `NODE_ENV`: production

## 📝 注意事項

1. **API密鑰安全**: 建議在Zeabur中設置環境變數而不是硬編碼在代碼中
2. **域名**: 可以綁定自定義域名獲得更專業的URL
3. **SSL證書**: Zeabur自動提供SSL證書，無需額外配置

## 🎯 測試部署

部署完成後：
1. 訪問 `https://your-app-name.zeabur.app/test.html` 測試功能
2. 在Outlook中載入更新後的manifest.xml
3. 測試插件功能是否正常

## 💡 故障排除

- 檢查Zeabur控制台的部署日誌
- 確認所有文件都已正確上傳
- 驗證環境變數設置
- 測試API連接是否正常