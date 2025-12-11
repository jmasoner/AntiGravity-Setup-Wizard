@echo off
cls
echo ==================================================
echo    AntiGravity Setup Wizard Launcher
echo ==================================================
echo.
echo Starting development server...
echo The application will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ==================================================
echo.

REM Wait 3 seconds then open browser
start /B timeout /t 3 /nobreak >nul && start http://localhost:5173

REM Start the development server
npm run dev

pause
