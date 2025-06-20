// utils/llm.js
// Importar las librerías necesarias
import { Ollama } from "@langchain/ollama";
import dotenv from 'dotenv';

dotenv.config();

// Variable global para el modelo LLM
let llm = null;

// Modelos disponibles:
// llama3 -> 7b
// qwen2.5-coder:0.5b -> 0.5b

/**
 * Configura el modelo LLM utilizando Ollama.
 * Asegúrate de que Ollama esté corriendo y el modelo especificado esté descargado.
 */
function configureLlm() {
    try {
        const modelName = process.env.OLLAMA_MODEL || "qwen2.5-coder:0.5b"; // Puedes configurar el modelo en .env
        llm = new Ollama({ model: modelName });
        console.log(`✅ Modelo LLM '${modelName}' configurado con Ollama.`);
    } catch (error) {
        console.error(`❌ Error al configurar el modelo LLM: ${error.message}`);
        throw new Error(`Error al configurar el modelo LLM: ${error.message}`); // Relanza para que el server no inicie sin LLM
    }
}

/**
 * Función para interactuar con el LLM y obtener una respuesta.
 * Incluye lógica para respuestas personalizadas y manejo de errores.
 * @param {string} userMessage - El mensaje de entrada del usuario.
 * @returns {Promise<string>} La respuesta generada por el LLM.
 * @throws {Error} Si el modelo LLM no está configurado o hay un error en la interacción.
 */
async function chatWithLlm(userMessage) {
    if (!llm) {
        throw new Error("❌ El modelo LLM no está configurado. Llama a configureLlm() primero.");
    }

    try {
        // Respuesta personalizada si el usuario pregunta "¿Quién eres?"
        if (userMessage.toLowerCase().includes("¿quién eres?") || userMessage.toLowerCase().includes("¿qué eres?")) {
            return "Soy un chatbot asistente diseñado para la Universidad de Las Tunas, aquí para ayudarte con tus preguntas y necesidades.";
        }

        // Puedes agregar más lógica de pre-procesamiento o prompts complejos aquí
        const template = `
        User: {user_message}
        AI:
        `;
        const prompt = template.replace("{user_message}", userMessage);

        const response = await llm.invoke(prompt);
        return response.trim();

    } catch (error) {
        console.error(`❌ Error en la interacción con el LLM: ${error.message}`);
        // Considera si quieres devolver un mensaje de error genérico al usuario o relanzar el error
        throw new Error("Hubo un error al procesar tu mensaje con el modelo de IA.");
    }
}

export { configureLlm, chatWithLlm };
