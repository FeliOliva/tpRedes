const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT3 = process.env.PORT3;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



app.post("/create_user", async (req, res) => {
  try {
    const { nombre, apellido, usuario, password, rol_id, estado } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO usuarios (nombre, apellido, usuario, password, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, apellido, usuario, password, rol_id, estado]
    );
    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al ejecutar la query", err);
    res.status(500).json({ error: "Error al crear los usuarios" });
  }
});

app.listen(PORT3, () => {
  console.log(`Servidor de practico corriendo en http://localhost:${PORT3}`);
});

