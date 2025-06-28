#!/bin/bash

# Este script levanta todos los microservicios de la aplicación en modo desarrollo.
# Se espera que este script se ejecute desde el directorio raíz del proyecto.

# --- Configuración ---

# Define la ruta base del proyecto.
PROJECT_ROOT=$(dirname "$(realpath "$0")")

# Servicios definidos como [ruta_relativa]="Nombre para logs:Puerto esperado"
declare -A SERVICES
SERVICES["api-gateway"]="API Gateway:4000"
SERVICES["services/user-auth-service"]="User Auth Service:3000"
SERVICES["services/chat-llm-service"]="Chat LLM Service:4001"
SERVICES["services/notas-estudiantes-service"]="Notas Estudiantes Service:3002"
SERVICES["services/votacion-service"]="Votacion Service:3003"
SERVICES["services/libreria-service"]="Libreria Service:3004"
SERVICES["services/comedor-service"]="Comedor Service:3005"

# PIDs de los procesos lanzados
PIDS=()

# --- Funciones ---

# Detiene todos los servicios al salir
cleanup() {
    echo -e "\n\n🧹 Deteniendo todos los microservicios..."
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            echo "   Proceso con PID $pid detenido."
        else
            echo "   Proceso con PID $pid ya no está en ejecución."
        fi
    done
    echo "✅ Todos los microservicios detenidos."
    exit 0
}

# Captura Ctrl+C para llamar a cleanup
trap cleanup SIGINT

# Inicia un servicio dado
start_service() {
    local service_path="$1"
    local service_name_log="$2"
    local expected_port="$3"

    echo -e "\n🚀 Levantando $service_name_log (en $service_path, puerto: $expected_port)..."

    pushd "$PROJECT_ROOT/$service_path" > /dev/null || { echo "❌ No se pudo entrar a $service_path"; exit 1; }

    # Verifica si existe un script 'start' en package.json
    if [ -f package.json ] && grep -q '"start":' package.json; then
        npm start &
        local pid=$!
        PIDS+=("$pid")
        echo "   $service_name_log iniciado con PID $pid usando 'npm start'."
    else
        echo "❌ No se encontró 'npm start' en $service_path. Abortando."
        popd > /dev/null
        exit 1
    fi

    popd > /dev/null || { echo "❌ No se pudo volver al directorio raíz"; exit 1; }
}

# --- Ejecución Principal ---

echo "--- Iniciando la suite de Microservicios ---"

PIDS=()

for service_dir in "${!SERVICES[@]}"; do
    IFS=':' read -r service_name_log expected_port <<< "${SERVICES[$service_dir]}"
    start_service "$service_dir" "$service_name_log" "$expected_port"
done

echo -e "\n------------------------------------------------------------"
echo "✅ Todos los microservicios se están ejecutando en segundo plano."
echo "Presiona Ctrl+C para detenerlos."
echo "------------------------------------------------------------"

wait

echo "Script finalizado."
