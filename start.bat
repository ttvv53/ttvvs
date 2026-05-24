@echo off
echo ========================================
echo   午夜庄园谜案 - 快速启动
echo ========================================
echo.
echo 正在启动游戏服务器...
echo.
echo 启动后请打开浏览器访问：
echo   http://localhost:5174
echo.
echo 如需分享给朋友，请使用 ngrok：
echo   ngrok http 3001
echo.
echo ========================================
echo.

call npm run dev
