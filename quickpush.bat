@echo off
echo 快速推送到GitHub...
git add .
git commit -m "Quick update: %date% %time%"
git push origin main
if %errorlevel% neq 0 (
    git push origin main --force
)
echo 完成! 
echo 倉庫: https://github.com/samulee003/outlook-ai-assistant
pause