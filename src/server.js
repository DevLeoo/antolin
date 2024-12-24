const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "antolin",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      sap_code VARCHAR(255) NOT NULL,
      part_number INT NOT NULL,
      project VARCHAR(255) NOT NULL,
      client VARCHAR(255) NOT NULL,
      quantity INT NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err);
    } else {
      console.log("Tabela 'products' pronta para uso.");
    }
  });
});

app.get("/", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.send("Erro ao carregar os produtos.");
    }
    res.render("consulta", { products: results });
  });
});

app.get("/new", (req, res) => {
  res.render("cadastro");
});

app.post("/cadastrar", (req, res) => {
  const { partNumber, projeto, cliente, sap, quantidade } = req.body;

  if (!partNumber || !projeto || !cliente || !sap || quantidade <= 0) {
    return res.send("Erro ao registrar produto. Preencha todos os campos corretamente.");
  }

  const insertQuery = `
    INSERT INTO products (sap_code, part_number, project, client, quantity)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [sap, partNumber, projeto, cliente, quantidade];

  db.query(insertQuery, values, (err) => {
    if (err) {
      console.error("Erro ao inserir produto:", err);
      return res.send("Erro ao cadastrar o produto. Tente novamente.");
    }

    res.redirect("/");
  });
});

app.post("/editar", (req, res) => {
  const { id, partNumber, projeto, cliente, sap, quantidade } = req.body;

  const updateQuery = `
    UPDATE products 
    SET sap_code = ?, part_number = ?, project = ?, client = ?, quantity = ? 
    WHERE id = ?
  `;

  const values = [sap, partNumber, projeto, cliente, quantidade, id];

  db.query(updateQuery, values, (err) => {
    if (err) {
      console.error("Erro ao editar produto:", err);
      return res.send("Erro ao editar o produto. Tente novamente.");
    }

    res.redirect("/");
  });
});

app.post("/excluir", (req, res) => {
  const { id } = req.body;

  const deleteQuery = "DELETE FROM products WHERE id = ?";

  db.query(deleteQuery, [id], (err) => {
    if (err) {
      console.error("Erro ao excluir produto:", err);
      return res.send("Erro ao excluir o produto. Tente novamente.");
    }

    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
