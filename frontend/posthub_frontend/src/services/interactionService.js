import api from './api';

const interactionService = {
  /**
   * Reage a um post com 'like' ou 'dislike' (Requer Autenticação)
   * Se a reação for idêntica à anterior, ela é removida pelo backend.
   * @param {string} postId - UUID do post
   * @param {string} reactionType - 'like' ou 'dislike'
   * @returns {Promise<Object>} Resposta com a ação realizada (created, updated, removed)
   */
  async reactToPost(postId, reactionType) {
    const response = await api.post(`/posts/${postId}/react/`, {
      type: reactionType,
    });
    return response.data;
  },

  /**
   * Obtém a lista de comentários de um post
   * @param {string} postId - UUID do post
   * @returns {Promise<Array>} Lista de comentários do post
   */
  async getPostComments(postId) {
    const response = await api.get(`/posts/${postId}/comments/`);
    return response.data;
  },

  /**
   * Adiciona um novo comentário a um post (Requer Autenticação)
   * @param {string} postId - UUID do post
   * @param {string} content - Texto do comentário
   * @returns {Promise<Object>} Comentário criado
   */
  async addComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments/`, {
      content,
    });
    return response.data;
  },

  /**
   * Registra o compartilhamento de um post (Requer Autenticação)
   * @param {string} postId - UUID do post
   * @returns {Promise<Object>} Resposta com a métrica atualizada de compartilhamentos
   */
  async sharePost(postId) {
    const response = await api.post(`/posts/${postId}/share/`);
    return response.data;
  },
};

export default interactionService;
