const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT4 = process.env.PORT4;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
app.listen(PORT4, () => {
  console.log(`Servidor de practico corriendo en http://localhost:${PORT4}`);
});
