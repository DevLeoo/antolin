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

const response = (type, title, message) => {

  const color = type == "S" ? "green" : "red"
  return `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Sucesso</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
            }
            h1 {
              color: ${color};
            }
            p {
              color: gray;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <p>${message}</p>
          </div>
          <script>
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          </script>
        </body>
      </html>
    `
}


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
  res.render("cadastro");
});

app.post("/cadastrar", (req, res) => {
  const { partNumber, projeto, cliente, sap, quantidade } = req.body;

  if (!partNumber || !projeto || !cliente || !sap || quantidade <= 0) {
    return res.send(response("E", "Erro ao registrar produto!", "Por favor, preencha todos os campos corretamente!"));
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

    res.send(response("S", "Produto cadastrado com sucesso!", "Redirecionando para a página inicial..."));
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
