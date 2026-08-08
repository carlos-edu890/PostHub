import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import postService from '../services/postService';
import PostCard from '../components/PostCard';
import ConfirmModal from '../components/ConfirmModal';
import {
  FileText,
  PenSquare,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  ArrowRight,
  Inbox,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Mais Recentes', icon: Clock },
  { value: '-likes', label: 'Mais Curtidos', icon: ThumbsUp },
  { value: '-dislikes', label: 'Mais Descurtidos', icon: ThumbsDown },
  { value: '-comments', label: 'Mais Comentados', icon: MessageSquare },
];

const MyPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [ordering, setOrdering] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estado para exclusão via ConfirmModal
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = useCallback(async (sortOrder, pageNum = 1, isAppend = false) => {
    try {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await postService.getMyPosts(sortOrder, pageNum);
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
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMyPosts(ordering, 1, false);
  }, [ordering, fetchMyPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMyPosts(ordering, nextPage, true);
  };

  const handleEdit = (post) => {
    navigate(`/editar-post/${post.id}`);
  };

  const handleDeletePrompt = (post) => {
    setPostToDelete(post);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      setDeleting(true);
      await postService.deletePost(postToDelete.id);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch {
      // Tratar erro de exclusão se necessário
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Cabeçalho e Botão Criar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-400" />
            Meus Posts
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gerencie, ordene, edite e exclua as suas publicações na plataforma.
          </p>
        </div>

        <Link
          to="/criar-post"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0"
        >
          <PenSquare className="w-4 h-4" />
          Novo Post
        </Link>
      </div>

      {/* Botões / Filtros de Ordenação */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase text-zinc-400 mr-2">Ordenar por:</span>
        {SORT_OPTIONS.map((opt) => {
          const IconComp = opt.icon;
          const isActive = ordering === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setOrdering(opt.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border border-indigo-500'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Lista de Posts */}
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
            <PostCard
              key={post.id}
              post={post}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))}

          {/* Carregar Mais */}
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
                    Ver Mais Posts
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Estado Vazio */
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-200">Você ainda não tem posts</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">
              Compartilhe suas ideias e histórias com a comunidade. Crie o seu primeiro post agora mesmo!
            </p>
          </div>
          <Link
            to="/criar-post"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <PenSquare className="w-4 h-4" />
            Criar Primeiro Post
          </Link>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Post */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        title="Excluir Post Permanentemente"
        message={`Tem certeza de que deseja excluir o post "${postToDelete?.title}"? Esta ação é irreversível.`}
        confirmText="Sim, Excluir Post"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onClose={() => setPostToDelete(null)}
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
};

export default MyPosts;
