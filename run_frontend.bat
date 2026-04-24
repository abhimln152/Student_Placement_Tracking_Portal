@echo off
echo Starting React Frontend...
set PATH=%~dp0node\node-v20.11.1-winx64;%PATH%
cd %~dp0frontend
npm run dev
pause
