const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decoded;
    next();
  });
};

//Genera Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Obtener todos los usuarios
    const { data: users } = await axios.get(
      "http://localhost:3001/all_registers"
    );

    // Buscar el usuario en la base de datos
    const user = users.find(
      (user) => user.usuario === username && user.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Generar el token para el usuario encontrado
    const tokenPayload = {
      username: user.usuario,
      estado: user.estado,
      rol_nombre: user.rol_nombre,
    };
    const token = generateToken(tokenPayload);

    // Devolver el token y la información del usuario
    res.json({ token, estado: user.estado, rol_username: user.rol_nombre });
  } catch (error) {
    console.error("Error al obtener registros de usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/registros", verifyToken, async (req, res) => {
  try {
    // Obtener registros de usuarios (protegido por token)
    const response = await axios.get("http://localhost:3001/all_registers");
    const registros = response.data;
    res.json({ registros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

app.put("/habilitar/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const response = await axios.put(`http://localhost:3003/hab_user/${id}`, {
      estado,
    });
    res.json({ message: "Usuario habilitado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al habilitar el usuario" });
  }
});

app.put("/deshabilitar/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const response = await axios.put(
      `http://localhost:3004/des_hab_user/${id}`,
      {
        estado,
      }
    );

    res.json({ message: "Usuario deshabilitado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al deshabilitar el usuario" });
  }
});

app.post("/crearUsuario", verifyToken, async (req, res) => {
  try {
    const { nombre, apellido, usuario, password, rol_id, estado } = req.body;
    const response = await axios.post("http://localhost:3002/create_user", {
      nombre,
      apellido,
      usuario,
      password,
      rol_id,
      estado,
    });
    res.json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor de index corriendo en http://localhost:${PORT}`);
});

app.get("/zorros", verifyToken, async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3005/zorros");
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los zorros" });
  }
});
