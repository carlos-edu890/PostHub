import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import postService from '../services/postService';
import PostCard from '../components/PostCard';
import { Search as SearchIcon, Inbox, ArrowRight } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Executa a busca de posts
  const executeSearch = async (query, pageNum = 1, isAppend = false) => {
    if (!query.trim()) {
      setPosts([]);
      setHasMore(false);
      return;
    }

    try {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await postService.searchPosts(query.trim(), pageNum);
      const results = data.results || (Array.isArray(data) ? data : []);

      if (isAppend) {
        setPosts((prev) => [...prev, ...results]);
      } else {
        setPosts(results);
      }

      setHasMore(Boolean(data.next));
    } catch {
      if (!isAppend) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setSearchTerm(queryParam);
    setPage(1);
    executeSearch(queryParam, 1, false);
  }, [queryParam]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    executeSearch(queryParam, nextPage, true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Cabeçalho da Busca */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <SearchIcon className="w-7 h-7 text-indigo-400" />
          Busca de Posts
        </h1>
        <p className="text-sm text-zinc-400">
          Encontre conteúdos por palavra-chave no título das publicações
        </p>

        {/* Input de Pesquisa Direta */}
        <form onSubmit={handleFormSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o termo da busca..."
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-base pl-12 pr-28 py-3 rounded-2xl border border-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-lg transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Resultados da Busca */}
      <div className="space-y-4">
        {queryParam && (
          <div className="text-sm text-zinc-400 pb-2 border-b border-zinc-800">
            Exibindo resultados para: <span className="font-semibold text-indigo-400">"{queryParam}"</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl animate-pulse space-y-3"
              >
                <div className="w-1/3 h-5 bg-zinc-800 rounded" />
                <div className="w-full h-10 bg-zinc-800/60 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Carregamento Contínuo / Paginação */}
            {hasMore && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-medium text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      Carregando mais...
                    </>
                  ) : (
                    <>
                      Carregar Mais Posts
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : queryParam ? (
          /* Estado Vazio para Busca sem Resultados */
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200">
              Nenhum post encontrado
            </h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Não encontramos nenhum post com o título correspondente a "{queryParam}". Tente buscar por outros termos.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Digite um termo na caixa de busca acima para pesquisar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
