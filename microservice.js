const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT2 = process.env.PORT2;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  const client = await pool.connect();
  try {
    // Crear la tabla de roles
    await client.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          nombre TEXT NOT NULL UNIQUE,
          estado INT NOT NULL
        )
      `);

    // Crear la tabla de usuarios
    await client.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          usuario TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          rol_id INT NOT NULL,
          estado INT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (rol_id) REFERENCES roles (id)
        )
      `);
  } catch (err) {
    console.error("Error creando las tablas", err);
  } finally {
    client.release();
  }
})();

app.get("/all_registers", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM usuarios");
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error al ejecutar la query", err);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
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

app.put("/hab_user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE usuarios SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );
    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al ejecutar la query", err);
    res.status(500).json({ error: "Error al habilitar los usuarios" });
  }
});

app.put("/des_hab_user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE usuarios SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );
    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al ejecutar la query", err);
    res.status(500).json({ error: "Error al deshabilitar los usuarios" });
  }
});

app.listen(PORT2, () => {
  console.log(`Servidor de practico corriendo en http://localhost:${PORT2}`);
});
