@echo off
echo ========================================
echo    Outlook AI Assistant - Auto Git
echo ========================================
echo.

:: 檢查是否有未提交的更改
echo [1/4] 檢查Git狀態...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo 錯誤: 這不是一個Git倉庫
    pause
    exit /b 1
)

:: 添加所有更改
echo [2/4] 添加所有更改...
git add .
if %errorlevel% neq 0 (
    echo 錯誤: 無法添加文件
    pause
    exit /b 1
)

:: 檢查是否有要提交的更改
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo 沒有要提交的更改
    echo.
    echo 當前狀態:
    git status --short
    pause
    exit /b 0
)

:: 提交更改（使用時間戳作為提交信息）
echo [3/4] 提交更改...
for /f "tokens=1-4 delims=/ " %%i in ('date /t') do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ('time /t') do set mytime=%%i:%%j
set commit_msg=Auto commit: %mydate% %mytime%

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo 錯誤: 提交失敗
    pause
    exit /b 1
)

:: 推送到遠程倉庫
echo [4/4] 推送到GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo 錯誤: 推送失敗
    echo 嘗試強制推送...
    git push origin main --force
    if %errorlevel% neq 0 (
        echo 錯誤: 強制推送也失敗了
        pause
        exit /b 1
    )
)

echo.
echo ✅ 成功! 所有更改已推送到GitHub
echo 倉庫地址: https://github.com/samulee003/outlook-ai-assistant
echo.
echo 現在可以在Zeabur中重新部署了
pause