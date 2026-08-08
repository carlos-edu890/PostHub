import api from './api';

const authService = {
  /**
   * Realiza o registro de um novo usuário
   * @param {Object} userData - { username, email, password }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  /**
   * Realiza o login do usuário (aceita email ou username)
   * @param {Object} credentials - { email, username, password }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Realiza o logout do usuário revogando a sessão/token no backend
   * @returns {Promise<{ detail: string }>}
   */
  async logout() {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  /**
   * Obtém os dados do perfil do usuário logado
   * @returns {Promise<Object>} Dados do usuário
   */
  async getCurrentUser() {
    const response = await api.get('/users/me/');
    return response.data;
  },

  /**
   * Atualiza os dados do perfil do usuário logado (bio, avatar, etc)
   * @param {Object} profileData - Objeto contendo os campos a serem atualizados
   * @returns {Promise<Object>} Dados atualizados do usuário
   */
  async updateProfile(profileData) {
    const response = await api.patch('/users/me/', profileData);
    return response.data;
  },

  /**
   * Solicita a exclusão permanente da conta do usuário logado
   * @returns {Promise<Object>}
   */
  async deleteAccount() {
    const response = await api.delete('/users/me/');
    return response.data;
  },
};

export default authService;
