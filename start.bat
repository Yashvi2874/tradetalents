@echo off
echo Starting TradeTalents Application...

REM Start the backend server in a new command window
start "Backend Server" cmd /k "cd backend && npm start"

REM Wait a few seconds for the backend to start
timeout /t 5 /nobreak >nul

REM Start the frontend development server
cd frontend
npm run dev

echo TradeTalents Application started successfully!
pause