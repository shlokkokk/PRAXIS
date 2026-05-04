Write-Host "==========================================" -ForegroundColor Red
Write-Host "       KILLING PRAXIS SERVERS             " -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red
Write-Host ""

Write-Host "1) Closing the PowerShell windows..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.MainWindowTitle -match "PRAXIS-Frontend" -or $_.MainWindowTitle -match "PRAXIS-Backend" } | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "-> Windows closed." -ForegroundColor Green

Write-Host "2) Deep-cleaning processes on ports..." -ForegroundColor Yellow
function Kill-ProcessByPort($port) {
    $connections = netstat -ano | findstr LISTENING | findstr ":$port "
    if ($connections) {
        foreach ($conn in $connections) {
            $parts = $conn -split '\s+'
            $pidToKill = $parts[-1]
            if ($pidToKill -ne "0" -and $pidToKill -match "^\d+$") {
                Write-Host "Found stubborn process $pidToKill on port $port. Terminating..." -ForegroundColor Red
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                Write-Host "-> Destroyed process $pidToKill (Port $port)." -ForegroundColor Green
            }
        }
    } else {
        Write-Host "Port $port is clean." -ForegroundColor Gray
    }
}

Write-Host "Checking Frontend (Port 5173)..."
Kill-ProcessByPort 5173

Write-Host "Checking Backend (Port 8000)..."
Kill-ProcessByPort 8000

Write-Host ""
Write-Host "Total cleanup complete! All servers and windows are dead." -ForegroundColor Cyan
