const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

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
    //aca usamos el microservicio de obtener todos los usuarios
    const { data: users } = await axios.get(
      "http://localhost:6001/all_registers"
    );

    // buscar el usuario en la bd en la tabla usuarios
    const user = users.find(
      (user) => user.usuario === username && user.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Generar el token para el usuario encontrado con el estado y rol_id para despues trabajar en el front 
    const tokenPayload = {
      username: user.usuario,
      estado: user.estado,
      rol_id: user.rol_id,
    };
    const token = generateToken(tokenPayload);
    //este res.json devuelve el token que usamos para hacer las otras peticiones teniendo el verifyToken y ademas el rol_id y el estado que nos van a permitir limitar las funciones de logearte y de realizar acciones
    res.json({ token, estado: user.estado, rol_id: user.rol_id }); 
  } catch (error) {
    console.error("Error al obtener registros de usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/registros", verifyToken, async (req, res) => {
  try {
    const response = await axios.get("http://localhost:6001/all_registers");
    const registros = response.data;
    res.json({ registros });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
});
