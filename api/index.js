const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8001;

// Habilitar CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/items", require("./routes/items.routes"));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// app.listen(3000, () => {
//   console.log("Servidor backend corriendo en http://localhost:3000");