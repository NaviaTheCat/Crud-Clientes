const db = require("../models/dbConfig");


exports.getItems = (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


exports.createItem = (req, res) => {
  const { nombre } = req.body;

  const sql = "INSERT INTO clientes (nombre) VALUES (?)";
  db.execute(sql, [nombre], err => {
    if (err) return res.status(500).json(err);
    res.sendStatus(201);
  });
};


exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  const sql = "UPDATE clientes SET nombre=? WHERE id=?";
  db.execute(sql, [nombre, id], err => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
};


exports.deleteItem = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM clientes WHERE id=?";
  db.execute(sql, [id], err => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
};
