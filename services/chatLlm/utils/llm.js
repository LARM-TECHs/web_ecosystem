// Importar las librerías necesarias
import { Ollama } from "@langchain/ollama";
import express from "express";

import readline from "readline";


// Variable global para el modelo
let llm = null;
/*
Modelos:
llama3 -> 7b
qwen2.5-coder:0.5b -> 0.5b
*/

// --- Configurar LangChain con Ollama ---
function configureLlm() {
    try {
        llm = new Ollama({ model: "qwen2.5-coder:0.5b" }); // Nombre del modelo en Ollama
        console.log("✅ LLaMA3 configurado correctamente en Ollama.");
    } catch (error) {
        console.error(`❌ Error al configurar LLaMA3: ${error.message}`);
    }
}

// --- Función para interactuar con el LLM ---
async function chatWithLlm(userMessage) {
    if (!llm) {
        throw new Error("❌ El modelo LLaMA3 no está configurado. Llama a configureLlm() primero.");
    }

    try {
        // Respuesta personalizada si el usuario pregunta "¿Quién eres?"
        if (userMessage.includes("¿Quién eres?") || userMessage.includes("¿Qué eres?")) {
            return "Soy un chatbot asistente diseñado para la Universidad de Las Tunas, aquí para ayudarte con tus preguntas y necesidades.";
        }

        // Crear el prompt
        const template = `
      User: {user_message}
      AI:
    `;
        const prompt = template.replace("{user_message}", userMessage);

        // Invocar el modelo
        const response = await llm.invoke(prompt);
        return response.trim();
    } catch (error) {
        console.error(`❌ Error en la interacción con LLaMA3: ${error.message}`);
        return "Hubo un error al procesar tu mensaje con el modelo de IA.";
    }
}

// --- Configurar el servidor Express ---
const app = express();
const port = 3000;

app.use(express.json());

// Endpoint para interactuar con el modelo
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "El campo 'message' es obligatorio." });
    }

    try {
        const response = await chatWithLlm(message);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
configureLlm(); // Configurar el modelo al iniciar
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });


// Interactuar con el modelo
// while (true) {
    // user_input = input("Escribe tu mensaje: ")
    // response = chat_with_llm(user_input)
// console.log(`Respuesta del modelo: ${chatWithLlm("Hola, ¿cómo estás?")}`.toString())
// }

// Interactuar con el modelo (ejemplo)
// (async () => {
//     const response = await chatWithLlm("Hola, ¿cómo estás?");
//     console.log(`Respuesta del modelo: ${response}`);
// })();
// async function interactuarConModelo() {
//     const response = await chatWithLlm("Hola, ¿cómo estás?");
//     console.log(`Respuesta del modelo: ${response}`);
// }


// --- Configurar readline para entrada de usuario ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Función para iniciar el bucle de entrada
function iniciarBucleEntrada() {
    rl.question("Escribe tu mensaje: ", async (input) => {
        const response = await chatWithLlm(input);
        console.log(`Respuesta del modelo: ${response}`);

        // Volver a preguntar al usuario
        iniciarBucleEntrada();
    });
}

// Iniciar el bucle de entrada
iniciarBucleEntrada();

export { configureLlm, chatWithLlm };
