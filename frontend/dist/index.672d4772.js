document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const formData = new FormData();
    const imagem = document.getElementById('imagem').files[0];
    const alt = document.getElementById('alt').value;
    formData.append('imagem', imagem);
    formData.append('alt', alt);
    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Erro ao enviar a imagem');
        const post = await response.json();
        console.log('Post criado:', post);
        loadPosts(); // Recarrega os posts após o envio
    } catch (error) {
        console.error('Erro:', error);
    }
});
// Função para carregar os posts
async function loadPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        const posts = await response.json();
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = ''; // Limpa posts anteriores
        posts.forEach((post)=>{
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h3>${post.alt}</h3>
                <img src="${post.imgUrl}" alt="${post.alt}" style="max-width: 100%;">
                <p>${post.descricao || "Descri\xe7\xe3o n\xe3o dispon\xedvel."}</p>
            `;
            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}
// Carrega os posts ao iniciar a página
loadPosts();

//# sourceMappingURL=index.672d4772.js.map
