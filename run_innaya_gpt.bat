@echo off
TITLE Innaya-GPT Launcher - Innayatullah International School, Iwo
COLOR 0A

echo ======================================================================
echo   INNAYA-GPT: LOCAL AI ASSISTANT FOR HIGH SCHOOL STUDENTS
echo   Innayatullah International School, Iwo, Osun State
echo ======================================================================
echo.

cd /d "%~dp0"

REM Find Python executable (prefer Laragon python if present, else system python)
SET PYTHON_CMD=python
IF EXIST "C:\laragon\bin\python\python-3.13\python.exe" (
    SET PYTHON_CMD="C:\laragon\bin\python\python-3.13\python.exe"
)

echo [1/2] Selected Python Environment: %PYTHON_CMD%
echo.
echo [2/2] Launching Innaya-GPT Local AI Server...
echo.
echo   Local Address: http://localhost:5000
echo   Remember to have Ollama running in another window (ollama run llama3.2:1b)
echo.

REM Automatically open web browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

%PYTHON_CMD% server.py

pause
