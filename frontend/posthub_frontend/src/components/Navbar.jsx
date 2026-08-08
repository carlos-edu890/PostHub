import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  PenSquare,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  BookOpen,
  Info,
  Mail,
  FileText,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Esquerda: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tight shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>
            Post<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        {/* Centro: Barra de Pesquisa (Desktop e Tablet) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
        >
          <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar posts por título..."
            className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm pl-9 pr-4 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </form>

        {/* Direita: Conteúdo Desktop de acordo com o estado do Usuário */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Botão Criar Post */}
              <Link
                to="/criar-post"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <PenSquare className="w-4 h-4" />
                Criar Post
              </Link>

              {/* Menu Avatar do Usuário */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 text-sm font-medium text-zinc-200 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate">{user?.username}</span>
                </button>

                {/* Dropdown Menu do Usuário */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                    <Link
                      to="/meus-posts"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Meus Posts
                    </Link>
                    <Link
                      to="/perfil"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      Meu Perfil
                    </Link>
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/sobre"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4 text-zinc-400" />
                Sobre Nós
              </Link>
              <Link
                to="/contato"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                Contato
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </>
          )}
        </div>

        {/* Botão do Menu Hambúrguer (Mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Expansível Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-6 pt-2 bg-zinc-950 border-b border-zinc-800 space-y-4 animate-fade-in">
          {/* Busca no Mobile */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar posts por título..."
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-sm pl-9 pr-4 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/criar-post"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-white bg-indigo-600 rounded-xl"
                >
                  <PenSquare className="w-4 h-4" />
                  Criar Post
                </Link>
                <Link
                  to="/meus-posts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 rounded-xl"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Meus Posts
                </Link>
                <Link
                  to="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 rounded-xl"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  Meu Perfil ({user?.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 rounded-xl"
                >
                  <Info className="w-4 h-4 text-zinc-400" />
                  Sobre Nós
                </Link>
                <Link
                  to="/contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 rounded-xl"
                >
                  <Mail className="w-4 h-4 text-zinc-400" />
                  Contato
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 text-sm font-medium text-white bg-indigo-600 rounded-xl justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  Fazer Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
