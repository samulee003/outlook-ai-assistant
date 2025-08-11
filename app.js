const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 設置CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 靜態文件服務
app.use(express.static(__dirname));

// 默認路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/taskpane/taskpane.html'));
});

// 測試路由
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test.html`);
  console.log(`📧 Outlook URL: http://localhost:${PORT}/src/taskpane/taskpane.html`);
});