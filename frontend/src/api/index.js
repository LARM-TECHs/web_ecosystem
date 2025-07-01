// src/api/index.js

// Importar y re-exportar todas las funciones de auth.js
export * from './auth.js';
export * from './comedor.js'; // Exporta todas las funciones de comedor.js
// export * from './chatLlm.js'; // Ya conectado, si está en otro archivo, asegúrate de exportarlo aquí
// export * from './library.js';
// export * from './notes.js';
// export * from './voting.js';

// Si prefieres exportaciones con nombres específicos para agrupar (opcional pero útil):
// import * as auth from './auth.js';
// import * as comedor from './comedor.js';
// export const api = {
//     auth,
//     comedor,
//     // ...otros servicios
// };
