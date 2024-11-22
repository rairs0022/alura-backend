import express from "express";
import conectarAoBanco from "./src/config/dbConfig.js";
import routes from "./src/routes/postsRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
routes(app);

app.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}...`);
});