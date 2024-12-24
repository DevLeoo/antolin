const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rota para renderizar a tela de cadastro
app.get("/", (req, res) => {
  res.render("cadastro");
});

app.post("/cadastrar", (req, res) => {
  const { partNumber, projeto, cliente, sap, quantidade } = req.body;

  // Validação básica
  if (!partNumber || !projeto || !cliente || !sap || quantidade <= 0) {
    return res.send("Por favor, preencha todos os campos corretamente!");
  }
    
  res.send(`
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
            color: green;
          }
          p {
            color: gray;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Produto cadastrado com sucesso!</h1>
          <p>Redirecionando para a página inicial...</p>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        </script>
      </body>
    </html>
  `);
})


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
