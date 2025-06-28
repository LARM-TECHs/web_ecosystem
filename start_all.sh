#!/bin/bash

# Este script levanta todos los microservicios de la aplicación en modo desarrollo.
# Se espera que este script se ejecute desde el directorio raíz del proyecto
# (donde están 'api-gateway' y la carpeta 'services').

# --- Configuración ---

# Define la ruta base de tu proyecto. Realpath asegura que la ruta sea absoluta.
PROJECT_ROOT=$(dirname "$(realpath "$0")")

# Array asociativo para definir los servicios: [directorio_relativo]="nombre_servicio_para_logs:puerto_esperado"
# Asegúrate de que los puertos listados aquí coincidan con los de tus archivos .env en cada servicio
declare -A SERVICES
SERVICES["api-gateway"]="API Gateway:4000"
SERVICES["services/user-auth-service"]="User Auth Service:3000"
SERVICES["services/chat-llm-service"]="Chat LLM Service:4001"
SERVICES["services/notas-estudiantes-service"]="Notas Estudiantes Service:3002"
SERVICES["services/votacion-service"]="Votacion Service:3003"
SERVICES["services/libreria-service"]="Libreria Service:3004"
SERVICES["services/comedor-service"]="Comedor Service:3005"

# Array para almacenar los PIDs (Process IDs) de los procesos iniciados.
# Esto nos permite detenerlos limpiamente después.
PIDS=()

# --- Funciones ---

# Función para limpiar y detener todos los procesos en segundo plano al salir.
cleanup() {
    echo -e "\n\n🧹 Deteniendo todos los microservicios..."
    for pid in "${PIDS[@]}"; do
        # Verifica si el proceso con este PID aún existe y está en ejecución
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

# Configura el 'trap' para ejecutar la función 'cleanup'
# cuando el script reciba una señal SIGINT (ej. Ctrl+C).
trap cleanup SIGINT

# Función para iniciar un servicio específico.
# Argumentos:
#   $1: service_path (ruta relativa al directorio del proyecto, ej. "api-gateway")
#   $2: service_name_log (nombre descriptivo para los logs, ej. "API Gateway")
#   $3: expected_port (puerto en el que se espera que se inicie el servicio)
start_service() {
    local service_path="$1"
    local service_name_log="$2"
    local expected_port="$3"

    echo -e "\n🚀 Intentando levantar $service_name_log (en $service_path, puerto: $expected_port)..."

    # Cambiar al directorio del servicio. Si falla, abortar el script.
    cd "$PROJECT_ROOT/$service_path" || { echo "❌ Error: No se pudo cambiar al directorio $service_path. Abortando." ; exit 1; }

    # Verificar si las dependencias de Node.js están instaladas.
    if [ ! -d "node_modules" ]; then
        echo "   Dependencias de Node.js no encontradas. Ejecutando 'npm install'..."
        npm install || { echo "❌ Error: 'npm install' falló en $service_path. Abortando." ; exit 1; }
    else
        echo "   Dependencias ya instaladas."
    fi

    # Iniciar el servicio. Prioriza 'npm run dev' (con nodemon) sobre 'npm start'.
    # Si 'npm run dev' no está definido, se usará 'npm start'.
    # El '2>&1' redirige stderr a stdout, y el '&' lo ejecuta en segundo plano.
    if npm run dev &> /dev/null; then # Prueba si 'npm run dev' existe
        npm run dev &
        PIDS+=($!) # Almacena el PID del proceso en segundo plano
        echo "   $service_name_log iniciado con PID ${PIDS[-1]} usando 'npm run dev'."
    elif npm start &> /dev/null; then # Si 'dev' no existe, prueba 'npm start'
        npm start &
        PIDS+=($!)
        echo "   $service_name_log iniciado con PID ${PIDS[-1]} usando 'npm start'."
    else
        echo "❌ Error: No se encontró un comando de inicio ('npm run dev' o 'npm start') en el package.json de $service_path. Abortando."
        exit 1
    fi

    # Volver al directorio raíz del proyecto para el siguiente servicio.
    cd "$PROJECT_ROOT" || { echo "❌ Error: No se pudo volver al directorio raíz del proyecto. Abortando." ; exit 1; }
}

# --- Ejecución Principal ---

echo "--- Iniciando la suite de Microservicios de Comedor ---"

# Limpiar el array de PIDs al inicio, por si acaso.
PIDS=()

# Iterar sobre cada servicio definido e iniciarlo.
for service_dir in "${!SERVICES[@]}"; do
    # Separar el nombre del log y el puerto esperado de la cadena
    IFS=':' read -r service_name_log expected_port <<< "${SERVICES[$service_dir]}"
    start_service "$service_dir" "$service_name_log" "$expected_port"
done

echo -e "\n------------------------------------------------------------"
echo "✅ Todos los microservicios se están ejecutando en segundo plano."
echo "Para detenerlos, presiona Ctrl+C en esta terminal."
echo "------------------------------------------------------------"

# El comando 'wait' hace que el script espere indefinidamente a que los procesos en segundo plano
# (los que hemos iniciado) terminen. Esto es esencial para que el 'trap' de SIGINT funcione
# y la función 'cleanup' se ejecute al presionar Ctrl+C.
wait

echo "Script finalizado."
