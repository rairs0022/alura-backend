import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções para lidar com os posts
import { gerarDescricaoComGemini } from '../services/geminiService.js'; // Importa a função do Gemini
import { ObjectId } from "mongodb"; // Importa ObjectId para validação

// Configura o armazenamento para os arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define o diretório onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Mantém o nome original do arquivo
  }
});

// Cria uma instância do Multer com a configuração de armazenamento
const upload = multer({ storage });

// Define as rotas da nossa API
const routes = (app) => {
  app.use(express.json());

  app.get("/posts", listarPosts); // Obtém todos os posts

  // Rota para criar um novo post com upload de imagem
  app.post("/posts", upload.single("imagem"), async (req, res) => {
    const novoPost = req.body;

    try {
      // Verifique se o arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      // Gere a descrição da imagem usando o buffer
      const descricaoGerada = await gerarDescricaoComGemini(req.file.buffer); // Use o buffer da imagem

      // Adicione a descrição gerada ao novoPost
      novoPost.descricao = descricaoGerada || "Descrição não disponível"; // Define um valor padrão se a descrição for null

      // Adicione a URL da imagem
      novoPost.imgUrl = `http://localhost:3000/uploads/${req.file.filename}`; // Adiciona a URL da imagem

      const postCriado = await colecao.insertOne(novoPost);
      res.status(201).json(postCriado);
    } catch (error) {
      console.error("Erro ao criar o post:", error);
      res.status(500).json({ "Erro": "Falha na criação do post" });
    }
  });

  // Rota para atualizar um post
  app.put("/upload/:id", upload.single("imagem"), async (req, res) => {
    const id = req.params.id; // Obtém o ID da URL

    // Verifica se o ID é fornecido e se é um formato válido
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const novoPost = {
      descricao: req.body.descricao,
      alt: req.body.alt,
      imgUrl: req.file ? `http://localhost:3000/uploads/${req.file.filename}` : undefined // Verifica se o arquivo foi enviado
    };

    try {
      const postAtualizado = await atualizarNovoPost(id, novoPost);
      res.status(200).json(postAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar o post:", error);
      res.status(500).json({ "Erro": "Falha na requisição" });
    }
  });
};

// Exporta a função de rotas para ser utilizada em outros módulos
export default routes;