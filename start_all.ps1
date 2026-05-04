Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       STARTING PRAXIS PLATFORM           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "=> Starting Frontend Server (React/Vite) on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'PRAXIS-Frontend'; cd '$PSScriptRoot'; npm install; npm run dev"

Write-Host "=> Starting Backend Server (FastAPI) on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'PRAXIS-Backend'; cd '$PSScriptRoot\api'; if (-Not (Test-Path venv)) { python -m venv venv }; .\venv\Scripts\activate; pip install -r requirements.txt; python main.py"

Write-Host ""
Write-Host "Servers are booting up in separate windows!" -ForegroundColor Magenta
Write-Host "  - Frontend: http://localhost:5173"
Write-Host "  - Backend:  http://localhost:8000"
Write-Host ""
Write-Host "To stop the servers later, run .\kill_all.ps1" -ForegroundColor Gray
