// utils/llm.js
// Importar las librerías necesarias
// import { Ollama } from "@langchain/ollama";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
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
// function configureLlm() {
//     try {
//         const modelName = process.env.OLLAMA_MODEL || "qwen2.5-coder:0.5b"; // Puedes configurar el modelo en .env
//         llm = new Ollama({ model: modelName });
//         console.log(`✅ Modelo LLM '${modelName}' configurado con Ollama.`);
//     } catch (error) {
//         console.error(`❌ Error al configurar el modelo LLM: ${error.message}`);
//         throw new Error(`Error al configurar el modelo LLM: ${error.message}`); // Relanza para que el server no inicie sin LLM
//     }
// }

function configureLlm() {
    const modelName = process.env.OLLAMA_MODEL || "qwen2.5-coder:0.5b";
    llm = new ChatOllama({ model: modelName });
    console.log(`✅ Modelo LLM '${modelName}' configurado con Ollama.`);
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

/**
 * Interactúa con el LLM usando un historial de chat y un nuevo input.
 * @param {Array<object>} history - Array de mensajes previos. Cada objeto debe tener { role: 'user' | 'assistant', content: '...' }.
 * @param {string} input - El nuevo mensaje del usuario.
 * @returns {Promise<AsyncIterable<any>>} Un stream iterable con los tokens de la respuesta del LLM.
 */
async function chatWithHistoryStream(history, input) {
    if (!llm) {
        throw new Error("❌ El modelo LLM no está configurado. Llama a configureLlm() primero.");
    }

    const systemPrompt = `Eres un asistente virtual de la Universidad de Las Tunas. Eres amable, servicial y tu conocimiento se centra en temas académicos, eventos de la universidad y vida estudiantil. Responde siempre en español. No debes responder preguntas sobre temas peligrosos o inapropiados.`;

    // Convierte el historial de la BD al formato que espera LangChain
    const messages = history.map(msg =>
        msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    // Crea la plantilla del prompt, incluyendo el prompt del sistema, el historial y el nuevo input
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ...messages,
        ["human", "{input}"],
    ]);

    // Crea la cadena que une el prompt con el modelo
    const chain = promptTemplate.pipe(llm);

    // Invoca la cadena con el input del usuario para obtener un stream de respuesta
    return await chain.stream({ input });
}

export { configureLlm, chatWithLlm, chatWithHistoryStream };
