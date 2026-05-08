REM Run a local development server for Smart Healthcare Access System
@echo off
REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python and ensure it's in your PATH.
    pause
    exit /b 1
)
REM Start HTTP server on port 8080
python -m http.server 8080
