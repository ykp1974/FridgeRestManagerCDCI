@echo off
set LOG_FILE=ci-result.log

echo [1/3] Starting Docker containers...
docker compose up -d

echo [2/3] Running Woodpecker CI...
:: WSL経由でwoodpecker execを実行し、結果をログファイルに出力します
wsl woodpecker exec > %LOG_FILE% 2>&1

echo [3/3] CI Process finished.
echo.
echo --- TEST RESULT SUMMARY ---
:: ログの最後の数行（結果部分）を画面に表示します
powershell -command "Get-Content %LOG_FILE% -Tail 15"
echo ---------------------------
echo.
echo Full log saved to: %LOG_FILE%
pause