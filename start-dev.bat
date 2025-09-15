@echo off
echo Starting Nachiketa Wellness Platform Development Environment...
echo.

echo Installing frontend dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Starting both frontend and backend servers...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:3001
echo.

call npm run dev:all

pause
