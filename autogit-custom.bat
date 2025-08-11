@echo off
chcp 65001 > nul
echo ========================================
echo    Outlook AI Assistant - Auto Git
echo ========================================
echo.

:: 檢查Git狀態
echo [檢查] Git狀態...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 這不是一個Git倉庫
    pause
    exit /b 1
)

:: 顯示當前狀態
echo 當前更改:
git status --short
echo.

:: 詢問用戶是否繼續
set /p continue="是否要提交這些更改? (y/n): "
if /i not "%continue%"=="y" (
    echo 操作已取消
    pause
    exit /b 0
)

:: 添加所有更改
echo.
echo [1/3] 添加所有更改...
git add .

:: 檢查是否有要提交的更改
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ℹ️  沒有要提交的更改
    pause
    exit /b 0
)

:: 詢問提交信息
echo.
set /p commit_msg="請輸入提交信息 (按Enter使用默認): "
if "%commit_msg%"=="" (
    for /f "tokens=1-4 delims=/ " %%i in ('date /t') do set mydate=%%i-%%j-%%k
    for /f "tokens=1-2 delims=: " %%i in ('time /t') do set mytime=%%i:%%j
    set commit_msg=Auto commit: %mydate% %mytime%
)

:: 提交更改
echo.
echo [2/3] 提交更改...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 提交失敗
    pause
    exit /b 1
)

:: 推送到遠程倉庫
echo [3/3] 推送到GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ⚠️  推送失敗，嘗試強制推送...
    git push origin main --force
    if %errorlevel% neq 0 (
        echo ❌ 錯誤: 推送失敗
        echo.
        echo 可能的解決方案:
        echo 1. 檢查網絡連接
        echo 2. 檢查GitHub權限
        echo 3. 手動運行: git push origin main
        pause
        exit /b 1
    )
)

echo.
echo ✅ 成功! 所有更改已推送到GitHub
echo 📁 倉庫地址: https://github.com/samulee003/outlook-ai-assistant
echo 🚀 現在可以在Zeabur中重新部署了
echo.
pause