@echo off
REM Backend Setup Script

echo ======================================
echo ReactNative Backend Setup
echo ======================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js is installed: %NODE_VERSION%

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy ".env.example" ".env"
    echo .env file created. Please update it with your MongoDB configuration.
)

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ======================================
    echo Setup completed successfully!
    echo ======================================
    echo.
    echo Next steps:
    echo 1. Update .env file with your MongoDB connection details
    echo 2. Start MongoDB
    echo 3. Run: npm run dev (for development)
    echo    Or: npm start (for production)
    echo.
    echo For more information, see README.md
) else (
    echo.
    echo Error during npm install. Please check the errors above.
    pause
    exit /b 1
)

pause
