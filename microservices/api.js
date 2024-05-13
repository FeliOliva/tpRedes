const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.use(cors());
const PORT6 = process.env.PORT6;

app.get("/zorros", async (req, res) => {
  try {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const apiUrl = `https://randomfox.ca/?i=${randomNumber}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT6, () => {
  console.log(`Servidor de práctica corriendo en http://localhost:${PORT6}`);
});
