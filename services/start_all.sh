#!/bin/bash

echo "🚀 Levantando servicios..."

# Usuarios (puerto 4000)
cd services/usuarios
node server.js &
echo "Usuarios levantado en puerto 4000"

# ChatLLM (puerto 3003)
cd ../chatLlm
node server.js &
echo "ChatLLM levantado en puerto 3003"

# NotasEstudiantes (puerto 3002)
cd ../notasEstudiantes
node server.js &
echo "NotasEstudiantes levantado en puerto 3002"

# Gateway (puerto 3000)
cd ../gateway
node server.js &
echo "Gateway levantado en puerto 3000"

wait
