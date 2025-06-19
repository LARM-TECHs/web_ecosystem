import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { sequelize } from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
    .then(() => {
        console.log('🔌 Conectado a la base de datos');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Auth service escuchando en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error de conexión a la base de datos:', err);
    });
