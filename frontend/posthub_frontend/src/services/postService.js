import api from './api';

const postService = {
  /**
   * Busca os posts mais curtidos nas últimas 24 horas (Top 5 por página)
   * @param {number} page - Número da página (padrão 1)
   * @returns {Promise<Object>} Resposta paginada com a lista de posts
   */
  async getTop24hPosts(page = 1) {
    const response = await api.get('/posts/feed/top24h/', {
      params: { page },
    });
    return response.data;
  },

  /**
   * Obtém o post mais curtido do usuário autenticado
   * @returns {Promise<Object>} Dados do post destaque
   */
  async getMyTopPost() {
    const response = await api.get('/posts/me/top/');
    return response.data;
  },

  /**
   * Busca a lista de posts criados pelo próprio usuário autenticado com suporte a ordenação
   * @param {string} ordering - Campo de ordenação (ex: '-likes', '-dislikes', '-comments', '-created_at')
   * @param {number} page - Número da página (padrão 1)
   * @returns {Promise<Object>} Resposta paginada de posts do usuário
   */
  async getMyPosts(ordering = '-created_at', page = 1) {
    const response = await api.get('/posts/me/', {
      params: { ordering, page },
    });
    return response.data;
  },

  /**
   * Pesquisa posts por título com paginação de 10 em 10 itens
   * @param {string} query - Termo de busca por título
   * @param {number} page - Número da página
   * @returns {Promise<Object>} Resposta paginada com posts encontrados
   */
  async searchPosts(query = '', page = 1) {
    const response = await api.get('/posts/search/', {
      params: { q: query, page },
    });
    return response.data;
  },

  /**
   * Busca os detalhes completos de um post pelo seu ID (público)
   * @param {string} id - UUID do post
   * @returns {Promise<Object>} Detalhes do post com autor e blocos
   */
  async getPostById(id) {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  /**
   * Cria um novo post com blocos dinâmicos de conteúdo (Requer Autenticação)
   * @param {Object} postData - { title: string, blocks: Array<{ block_type: string, content: string, order: number }> }
   * @returns {Promise<Object>} Post criado
   */
  async createPost(postData) {
    const response = await api.post('/posts/', postData);
    return response.data;
  },

  /**
   * Atualiza um post existente (Apenas o autor)
   * @param {string} id - UUID do post
   * @param {Object} postData - Objeto com os campos atualizados do post
   * @returns {Promise<Object>} Post atualizado
   */
  async updatePost(id, postData) {
    const response = await api.patch(`/posts/${id}/`, postData);
    return response.data;
  },

  /**
   * Exclui um post existente (Apenas o autor)
   * @param {string} id - UUID do post
   * @returns {Promise<Object>} Resposta da exclusão
   */
  async deletePost(id) {
    const response = await api.delete(`/posts/${id}/`);
    return response.data;
  },
};

export default postService;
