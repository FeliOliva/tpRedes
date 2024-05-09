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
    const result = await client.query("SELECT * FROM usuarios ORDER BY id");
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error al ejecutar la query", err);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});



app.listen(PORT2, () => {
  console.log(`Servidor de practico corriendo en http://localhost:${PORT2}`);
});
