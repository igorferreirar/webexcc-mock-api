const express = require('express');
const app = express();

app.use(express.json());

/* ===============================
   LOG GLOBAL (MOSTRA TUDO)
================================= */
app.use((req, res, next) => {
  console.log("====================================");
  console.log("Nova requisição recebida");
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Query:", req.query);
  console.log("====================================");
  next();
});

/* ===============================
   MOCK DATABASE
================================= */
const users = [
  { id: 1, cpf: "12345678901", primeiroNome: "Ana", ultimoNome: "Silva", cargo: "Atendente" },
  { id: 2, cpf: "98765432100", primeiroNome: "Carlos", ultimoNome: "Souza", cargo: "Supervisor" }
];

/* ===============================
   BASIC AUTH MIDDLEWARE
================================= */
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    console.log("❌ 401 - Authorization não enviada");
    return res.status(401).json({
      status: 401,
      error: "Authorization header required"
    });
  }

  const base64 = auth.split(" ")[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(":");

  if (user !== "admin" || pass !== "1234") {
    console.log("❌ 403 - Credencial inválida");
    return res.status(403).json({
      status: 403,
      error: "Invalid credentials"
    });
  }

  next();
};

/* ===============================
   ENDPOINT PRINCIPAL
================================= */
app.get('/colaborador', basicAuth, (req, res) => {

  const { cpf, id } = req.query;

  const user = users.find(u =>
    (cpf && u.cpf === cpf) ||
    (id && u.id == id)
  );

  if (!user) {
    console.log("❌ 404 - Usuário não encontrado");
    return res.status(404).json({
      status: 404,
      error: "User not found"
    });
  }

  console.log("✅ 200 - Usuário encontrado:", user);

  return res.status(200).json({
    status: 200,
    data: user
  });
});

/* ===============================
   HEALTH CHECK (VALIDATION URL)
================================= */
app.get('/health', basicAuth, (req, res) => {
  console.log("✅ Health check OK");
  res.status(200).json({ status: "UP" });
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
