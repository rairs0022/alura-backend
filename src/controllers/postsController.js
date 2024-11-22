import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
import { gerarDescricaoComGemini } from '../services/geminiService.js'; // Importa a função do Gemini

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function listarPosts(req, res) {
  const db = conexao.db("imersao-instabytes1");
  const colecao = db.collection("posts");
  const posts = await colecao.find().toArray();
  res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
  const novoPost = req.body; // Captura os dados do corpo da requisição
  const db = conexao.db("imersao-instabytes1");
  const colecao = db.collection("posts");

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

}

export async function atualizarNovoPost(id, novoPost) {
  const db = conexao.db("imersao-instabytes1");
  const colecao = db.collection("posts");

  try {
    if (!id || !ObjectId.isValid(id)) {
      throw new Error("ID não fornecido ou inválido.");
    }

    const resultado = await colecao.updateOne(
      { _id: new ObjectId(id) },
      { $set: novoPost }
    );

    if (resultado.modifiedCount === 0) {
      throw new Error("Nenhum post foi atualizado.");
    }

    return resultado;
  } catch (error) {
    console.error("Erro ao atualizar o post:", error);
    throw error; // Lança o erro para ser tratado no controlador
  }

  
}