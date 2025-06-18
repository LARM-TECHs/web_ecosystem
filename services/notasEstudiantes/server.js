import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import morgan from 'morgan';
import router from './routes/routes.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();

app.use(cors());
// app.use(morgan('dev'));
app.use(express.json());
app.use(router);

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware manejo global errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

sequelize.authenticate()
    .then(() => {
        console.log('🔌 Conectado a la base de datos');
        return sequelize.sync(); // { force: true } solo en desarrollo
    })
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Servicio Notas ejecutándose en port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err);
    });
