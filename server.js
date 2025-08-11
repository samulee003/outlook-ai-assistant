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
app.use(express.static('.'));

// 默認路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/taskpane/taskpane.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/src/taskpane/taskpane.html to test the interface`);
});