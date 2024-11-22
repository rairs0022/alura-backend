import { GoogleGenerativeAI } from "@google/generative-ai"; // Importa a classe correta

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Função para gerar descrição com o Google Gemini
export async function gerarDescricaoComGemini(imageBuffer) {
  const prompt = "Gere uma descrição em português do Brasil para a seguinte imagem";

  try {
    const image = {
      inlineData: {
        data: imageBuffer.toString("base64"), // Converte o buffer da imagem para base64
        mimeType: "image/png", // Define o tipo MIME da imagem
      },
    };
    const res = await model.generateContent([prompt, image]); // Chama a API para gerar o conteúdo
    console.log("Resposta da API:", res); // Log da resposta
    return res.response.text() || "Alt-text não disponível."; // Retorna a descrição gerada
  } catch (erro) {
    console.error("Erro ao obter alt-text:", erro.message, erro);
    throw new Error("Erro ao obter o alt-text do Gemini."); // Lança um erro se a geração falhar
  }
}