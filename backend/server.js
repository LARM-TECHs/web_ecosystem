// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const QRCode = require('qrcode');
const crypto = require('crypto');
import { connectDB, syncModels } from './config/db.js';
import routes from './routes/comedor-routes.js';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3001;

// Carga las variables de entorno
dotenv.config();

// Inicializar base de datos y servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
});

module.exports = app;