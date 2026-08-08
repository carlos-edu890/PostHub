import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, LogIn, UserPlus, X } from 'lucide-react';

const AuthModal = () => {
  const { showAuthModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!showAuthModal) return null;

  const handleNavigate = (path) => {
    closeAuthModal();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Container do Modal */}
      <div className="relative w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-all scale-100">
        {/* Botão Fechar */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone e Título */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 mb-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Autenticação Necessária
          </h3>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Você precisa estar logado para realizar esta ação (curtir, comentar, compartilhar ou criar posts).
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleNavigate('/login')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <LogIn className="w-4 h-4" />
            Fazer Login
          </button>
          <button
            onClick={() => handleNavigate('/register')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm rounded-xl border border-zinc-700 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
