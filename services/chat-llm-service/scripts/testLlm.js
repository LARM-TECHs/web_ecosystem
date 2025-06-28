// scripts/testLlm.js
import { configureLlm, chatWithLlm } from '../utils/llm.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
        // 1) Configura el LLM
        configureLlm();

        // 2) Envía un mensaje de prueba
        const userMessage = "¿Quién eres?";
        console.log('> User:', userMessage);

        const response1 = await chatWithLlm(userMessage);
        console.log('AI:', response1);

        // 3) Envía otra consulta libre
        const question = "¿Cuál es la capital de Francia?";
        console.log('> User:', question);

        const response2 = await chatWithLlm(question);
        console.log('AI:', response2);
    } catch (err) {
        console.error('Error en testLlm:', err);
    }
}

main();
