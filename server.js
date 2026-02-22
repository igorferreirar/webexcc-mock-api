const express = require('express');
const app = express();

const users = [
  { id: 1, cpf: "12345678901", primeiroNome: "Ana", ultimoNome: "Silva", cargo: "Atendente" },
  { id: 2, cpf: "98765432100", primeiroNome: "Carlos", ultimoNome: "Souza", cargo: "Supervisor" }
];

const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Authorization header required" });

  const base64 = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(":");

  if (user === "admin" && pass === "1234") {
    next();
  } else {
    return res.status(403).json({ error: "Invalid credentials" });
  }
};

app.get('/colaborador', basicAuth, (req, res) => {
  const { cpf, id } = req.query;

  const user = users.find(u =>
    (cpf && u.cpf === cpf) ||
    (id && u.id == id)
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
