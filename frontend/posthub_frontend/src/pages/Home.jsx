import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import PostCard from '../components/PostCard';
import {
  Flame,
  PenSquare,
  Sparkles,
  ThumbsUp,
  Inbox,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [myTopPost, setMyTopPost] = useState(null);
  const [loadingMyTop, setLoadingMyTop] = useState(false);

  // Busca os posts do feed Top 24h
  const fetchTopPosts = async (pageNumber = 1, isAppend = false) => {
    try {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await postService.getTop24hPosts(pageNumber);
      const results = data.results || (Array.isArray(data) ? data : []);

      if (isAppend) {
        setPosts((prev) => [...prev, ...results]);
      } else {
        setPosts(results);
      }

      setHasMore(Boolean(data.next));
    } catch {
      // Tratamento silencioso de erro ou lista vazia
      if (!isAppend) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Busca o post mais curtido do usuário logado
  const fetchMyTopPost = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingMyTop(true);
      const data = await postService.getMyTopPost();
      setMyTopPost(data);
    } catch {
      setMyTopPost(null);
    } finally {
      setLoadingMyTop(false);
    }
  };

  useEffect(() => {
    fetchTopPosts(1, false);
    fetchMyTopPost();
  }, [isAuthenticated]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTopPosts(nextPage, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Grid Principal: 2 Colunas no Desktop (lg), 1 Coluna no Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coluna Principal: Feed Top 5 (24h) (Ocupa 2 Colunas em lg) */}
        <main className="lg:col-span-2 space-y-6">
          {/* Cabeçalho do Feed */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Top 5 (24h)
                </h1>
                <p className="text-xs text-zinc-400">
                  Os posts com maior engajamento e curtidas nas últimas 24 horas
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              Em alta hoje
            </span>
          </div>

          {/* Lista de Posts / Estado de Carregamento / Estado Vazio */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-zinc-800 rounded" />
                      <div className="w-20 h-3 bg-zinc-800/60 rounded" />
                    </div>
                  </div>
                  <div className="w-3/4 h-6 bg-zinc-800 rounded" />
                  <div className="w-full h-12 bg-zinc-800/50 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Botão Ver Mais */}
              {hasMore && (
                <div className="pt-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        Carregando mais...
                      </>
                    ) : (
                      <>
                        Ver Mais Posts
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Estado Vazio (Empty State) */
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500">
                <Inbox className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-200">Não tem post</h3>
                <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                  Nenhum post foi publicado nas últimas 24 horas. Seja o primeiro a criar um conteúdo incrível!
                </p>
              </div>
              {isAuthenticated && (
                <Link
                  to="/criar-post"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  <PenSquare className="w-4 h-4" />
                  Criar Primeiro Post
                </Link>
              )}
            </div>
          )}
        </main>

        {/* Coluna Lateral (Sidebar): Botão Criar Post + Card Seu Post Mais Curtido */}
        <aside className="space-y-6">
          {/* Botão de Destaque para Criar Post */}
          <div className="p-6 bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-900 border border-indigo-500/20 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Compartilhe sua voz</h2>
                <p className="text-xs text-zinc-400">Crie publicações em blocos dinâmicos</p>
              </div>
            </div>
            <Link
              to={isAuthenticated ? '/criar-post' : '/login'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25"
            >
              <PenSquare className="w-4 h-4" />
              Criar Novo Post
            </Link>
          </div>

          {/* Card: Seu Post Mais Curtido */}
          <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-amber-400" />
                Seu Post Mais Curtido
              </h3>
            </div>

            {loadingMyTop ? (
              <div className="p-4 bg-zinc-950/40 rounded-xl animate-pulse space-y-2">
                <div className="w-3/4 h-4 bg-zinc-800 rounded" />
                <div className="w-1/2 h-3 bg-zinc-800/60 rounded" />
              </div>
            ) : myTopPost ? (
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl hover:border-indigo-500/50 transition-all space-y-2">
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full inline-block">
                  {myTopPost.likes_count ?? myTopPost.likes ?? 0} Curtidas
                </span>
                <Link
                  to={`/posts/${myTopPost.id}`}
                  className="block text-sm font-bold text-zinc-100 hover:text-indigo-400 line-clamp-2 transition-colors"
                >
                  {myTopPost.title}
                </Link>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {myTopPost.preview_text ||
                    (Array.isArray(myTopPost.blocks) && myTopPost.blocks[0]?.content) ||
                    'Clique para abrir seu post...'}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950/40 rounded-xl text-center space-y-2">
                <p className="text-xs text-zinc-400">
                  {isAuthenticated
                    ? 'Você ainda não possui posts com curtidas.'
                    : 'Faça login para ver seu post em destaque.'}
                </p>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="inline-block text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Entrar na Conta &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
