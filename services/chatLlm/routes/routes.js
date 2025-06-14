// Importar las dependencias necesarias
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize, DataTypes } from "sequelize";
import bodyParser from "body-parser";
import cors from "cors";

// Configuración inicial
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de Sequelize (base de datos)
const sequelize = new Sequelize("database_name", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});

// Definir modelos
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  user_type: { type: DataTypes.STRING, defaultValue: "user" },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Chat = sequelize.define("Chat", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  response: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  chat_id: { type: DataTypes.INTEGER, allowNull: false },
});

// Sincronizar la base de datos
(async () => {
  await sequelize.sync({ force: false }); // Cambia a `true` solo si quieres recrear las tablas
  console.log("Base de datos sincronizada.");
})();

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acceso no autorizado." });

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.user = user;
    next();
  });
}

// --- Ruta: Registro de usuario ---
app.post("/register", async (req, res) => {
  const { name, email, password, user_type = "user" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Se requieren nombre, correo y contraseña." });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "El correo ya está registrado." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      name,
      email,
      password: hashedPassword,
      user_type,
      registration_date: new Date(),
    });
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: `Error al registrar usuario: ${error.message}` });
  }
});

// --- Ruta: Inicio de sesión ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ message: "Inicio de sesión exitoso.", token });
});

// --- Ruta: Cerrar sesión ---
app.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Sesión cerrada correctamente." });
});

// --- Ruta: Chat con LLaMA3 ---
app.post("/chat", authenticateToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje no puede estar vacío." });
  }

  try {
    // Interactuar con el modelo LLaMA3 mediante LangChain
    const aiResponse = "Respuesta simulada del modelo"; // Reemplaza esto con la lógica real de chat_with_llm

    await Chat.create({
      user_id: req.user.id,
      content: message,
      response: aiResponse,
      timestamp: new Date(),
    });

    res.json({
      choices: [{ message: { role: "assistant", content: aiResponse } }],
    });
  } catch (error) {
    res.status(500).json({ error: `Error al procesar el mensaje: ${error.message}` });
  }
});

// --- Ruta: Lista de chats ---
app.get("/chats", authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      attributes: ["chat_id", [sequelize.fn("MIN", sequelize.col("timestamp")), "timestamp"]],
      where: { user_id: req.user.id },
      group: ["chat_id"],
    });

    const chatList = chats.map((chat) => ({
      chat_id: chat.chat_id,
      timestamp: chat.timestamp,
    }));

    res.json({ chats: chatList });
  } catch (error) {
    res.status(500).json({ error: `Error al recuperar la lista de chats: ${error.message}` });
  }
});

// --- Ruta: Historial de un chat específico ---
app.get("/chats/:chat_id", authenticateToken, async (req, res) => {
  const { chat_id } = req.params;

  try {
    const chats = await Chat.findAll({
      where: { chat_id, user_id: req.user.id },
    });

    if (!chats.length) {
      return res.status(404).json({ error: "Chat no encontrado." });
    }

    const history = chats.map((chat) => ({
      id: chat.id,
      message: chat.content,
      response: chat.response,
      timestamp: chat.timestamp,
    }));

    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: `Error al recuperar el historial: ${error.message}` });
  }
});

// --- Ruta: Verificación de sesión ---
app.get("/current", authenticateToken, (req, res) => {
  res.json({ message: `Usuario autenticado: ${req.user.email}` });
});

// --- Ruta protegida de prueba ---
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hola, ${req.user.email}. Estás viendo una ruta protegida.` });
});

// --- Ruta para errores no autorizados ---
app.use((req, res) => {
  res.status(401).json({ error: "No autorizado. Inicia sesión para continuar.", redirect: "/login" });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});