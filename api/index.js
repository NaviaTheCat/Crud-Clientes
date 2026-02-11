const express = require("express");
const cors = require("cors");

const app = express();

// Habilitar CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/items", require("./routes/items.routes"));

if (!process.env.VERCEL) {
	const PORT = process.env.PORT || 8001;
	app.listen(PORT, () => {
		console.log(`Servidor corriendo en http://localhost:${PORT}`);
	});
}

module.exports = app;