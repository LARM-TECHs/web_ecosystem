const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./models/init');
const comedorRoutes = require('./routes/comedor-routes');
const errorHandler = require('./middleware/error-handler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', comedorRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
});
