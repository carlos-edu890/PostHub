import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Função para efetuar logout e limpar estado local
  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        await authService.logout();
      }
    } catch {
      // Ignora erro ao deslogar no backend e garante limpeza local
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, []);

  // Inicialização e verificação de token armazenado no localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch {
          // Token inválido ou expirado
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Listener para capturar o evento de erro 401 disparado pelo api.js
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setShowAuthModal(true);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Função de Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Função de Registro
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil do usuário
  const updateUserProfile = async (profileData) => {
    const updatedUser = await authService.updateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  // Função para excluir conta do usuário
  const deleteUserAccount = async () => {
    await authService.deleteAccount();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Helper para controlar abertura/fechamento do Modal de aviso de Autenticação Necessária
  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  /**
   * Executa uma ação se o usuário estiver logado.
   * Se não estiver logado, exibe o modal solicitando login/cadastro.
   */
  const requireAuth = (actionCallback) => {
    if (token && user) {
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    } else {
      setShowAuthModal(true);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    showAuthModal,
    login,
    register,
    logout,
    updateUserProfile,
    deleteUserAccount,
    openAuthModal,
    closeAuthModal,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook useAuth para utilização direta em qualquer componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
