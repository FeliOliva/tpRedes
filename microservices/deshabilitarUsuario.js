const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT5 = process.env.PORT5;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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

app.listen(PORT5, () => {
  console.log(`Servidor de practico corriendo en http://localhost:${PORT5}`);
});
