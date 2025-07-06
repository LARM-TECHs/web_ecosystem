<#
.SYNOPSIS
    Arranca todos los microservicios en modo dev y los detiene con Ctrl+C.
#>

# --- Configuración de servicios (ruta relativa => "Nombre:Puerto") ---
$services = @{
    "api-gateway"                        = "API Gateway:4000"
    "services/user-auth-service"         = "User Auth Service:3000"
    "services/chat-llm-service"          = "Chat LLM Service:4001"
    "services/notas-estudiantes-service" = "Notas Estudiantes Service:3002"
    "services/votacion-service"          = "Votacion Service:3003"
    "services/libreria-service"          = "Libreria Service:3004"
    "services/comedor-service"           = "Comedor Service:3005"
}

# Array para almacenar objetos Process
$processes = @()

function Cleanup {
    Write-Host "`n🧹 Deteniendo todos los microservicios..." -ForegroundColor Yellow
    foreach ($p in $processes) {
        if (-not $p.HasExited) {
            Write-Host "   Deteniendo PID $($p.Id) ($($p.StartInfo.WorkingDirectory))"
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "✅ Todos los microservicios detenidos."
    exit
}

# --- Captura de Ctrl+C ---
# Creamos un handler y lo registramos con el método add_CancelKeyPress
$null = [System.Console]::add_CancelKeyPress( {
    param($sender, $eventArgs)
    # Evita que PowerShell cierre antes de limpiar
    $eventArgs.Cancel = $true
    Cleanup
})

Write-Host "--- Iniciando la suite de Microservicios ---" -ForegroundColor Cyan

foreach ($relPath in $services.Keys) {
    $parts    = $services[$relPath].Split(':')
    $name     = $parts[0]
    $port     = $parts[1]
    $fullPath = Join-Path $PSScriptRoot $relPath

    Write-Host "`n🚀 Levantando $name (ruta: $relPath, puerto: $port)..." -ForegroundColor Green

    if (-not (Test-Path "$fullPath\package.json")) {
        Write-Host "❌ No se encontró package.json en $relPath. Abortando." -ForegroundColor Red
        Cleanup
    }

    # En Windows, usar npm.cmd
    $proc = Start-Process -FilePath "npm.cmd" `
                          -ArgumentList "start" `
                          -WorkingDirectory $fullPath `
                          -NoNewWindow `
                          -PassThru

    $processes += $proc
    Write-Host "   $name iniciado con PID $($proc.Id)." -ForegroundColor DarkCyan
}

Write-Host "`n------------------------------------------------------------"
Write-Host "✅ Todos los microservicios se están ejecutando en segundo plano."
Write-Host "Presiona Ctrl+C para detenerlos."
Write-Host "------------------------------------------------------------"

# Mantener el script vivo hasta Ctrl+C
while ($true) {
    Start-Sleep -Seconds 1
}
