FROM node:18-alpine

WORKDIR /app

# 複製package.json
COPY package.json ./

# 安裝依賴
RUN npm install

# 複製所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["npm", "start"]