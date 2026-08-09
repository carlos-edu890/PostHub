import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import interactionService from '../services/interactionService';
import ErrorState from '../components/ErrorState';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Calendar,
  User,
  ExternalLink,
  Check,
  Send,
  ArrowLeft,
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const { requireAuth, user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de reações
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null

  // Estado do formulário de comentários
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Carrega o post e os comentários
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await postService.getPostById(id);
      setPost(postData);
      setLikesCount(postData.likes_count ?? postData.likes ?? 0);
      setDislikesCount(postData.dislikes_count ?? postData.dislikes ?? 0);
      setSharesCount(postData.shares_count ?? postData.shares ?? 0);
      setUserReaction(postData.user_reaction || null);

      // Busca a lista de comentários
      try {
        const commentsData = await interactionService.getPostComments(id);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch {
        setComments([]);
      }
    } catch {
      setError('Não foi possível carregar os detalhes deste post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  // Reação de Curtir / Descurtir
  const handleReaction = (reactionType) => {
    requireAuth(async () => {
      try {
        const res = await interactionService.reactToPost(id, reactionType);
        if (res.action === 'created') {
          if (reactionType === 'like') setLikesCount((prev) => prev + 1);
          if (reactionType === 'dislike') setDislikesCount((prev) => prev + 1);
          setUserReaction(reactionType);
        } else if (res.action === 'removed') {
          if (userReaction === 'like') setLikesCount((prev) => Math.max(0, prev - 1));
          if (userReaction === 'dislike') setDislikesCount((prev) => Math.max(0, prev - 1));
          setUserReaction(null);
        } else if (res.action === 'updated') {
          if (reactionType === 'like') {
            setLikesCount((prev) => prev + 1);
            setDislikesCount((prev) => Math.max(0, prev - 1));
          } else {
            setDislikesCount((prev) => prev + 1);
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
          setUserReaction(reactionType);
        }
      } catch {
        // Erro silencioso ou modal
      }
    });
  };

  // Compartilhamento
  const handleShare = () => {
    requireAuth(async () => {
      try {
        await interactionService.sharePost(id);
        setSharesCount((prev) => prev + 1);
      } catch {
        // Prossegue mesmo se registro de share falhar
      } finally {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    });
  };

  // Envio de novo comentário
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    requireAuth(async () => {
      try {
        setSubmittingComment(true);
        const commentObj = await interactionService.addComment(id, newComment.trim());
        setComments((prev) => [commentObj, ...prev]);
        setNewComment('');
      } catch {
        // Erro ao enviar comentário
      } finally {
        setSubmittingComment(false);
      }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] gap-3 text-zinc-400">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium">Carregando post completo...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ErrorState
          title={error ? 'Não foi possível carregar este post' : 'Post não encontrado'}
          message={error || 'O conteúdo solicitado não está disponível no momento.'}
          onRetry={() => fetchPostDetails()}
          linkTo="/"
          linkLabel="Voltar para a página inicial"
        />
      </div>
    );
  }

  const authorName = post.author?.username || post.author_username || 'Autor Anônimo';
  const authorAvatar = post.author?.avatar || post.author_avatar;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Botão Voltar */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Home
      </Link>

      {/* Cabeçalho do Post */}
      <header className="space-y-4 pb-6 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Autor e Metadados */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-11 h-11 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-base">
                {authorName.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </div>
            )}
            <div>
              <span className="block text-sm font-bold text-white">{authorName}</span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Calendar className="w-3.5 h-3.5" />
                Publicado em {formatDate(post.created_at)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sequência de Blocos de Conteúdo do Post */}
      <section className="space-y-6 text-zinc-200 text-base sm:text-lg leading-relaxed">
        {Array.isArray(post.blocks) && post.blocks.length > 0 ? (
          post.blocks.map((block, idx) => {
            if (block.block_type === 'text') {
              return (
                <div key={block.id || idx} className="whitespace-pre-wrap break-words">
                  {block.content}
                </div>
              );
            }
            if (block.block_type === 'image') {
              return (
                <div key={block.id || idx} className="my-6">
                  <img
                    src={block.content}
                    alt={`Multimídia do post ${idx + 1}`}
                    className="w-full max-h-[500px] object-cover rounded-2xl border border-zinc-800 shadow-xl"
                  />
                </div>
              );
            }
            if (block.block_type === 'video') {
              return (
                <div key={block.id || idx} className="my-6 aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                  <iframe
                    src={block.content}
                    title="Vídeo do Post"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              );
            }
            if (block.block_type === 'link') {
              return (
                <a
                  key={block.id || idx}
                  href={block.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 my-4 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-xl text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-all group"
                >
                  <span className="truncate max-w-md">{block.content}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              );
            }
            return null;
          })
        ) : (
          <p className="text-zinc-400 italic">Este post não possui blocos de conteúdo.</p>
        )}
      </section>

      {/* Barra de Interações (Reações, Compartilhamento) */}
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Botão Like */}
          <button
            onClick={() => handleReaction('like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              userReaction === 'like'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{likesCount}</span>
            <span className="hidden sm:inline">Curtir</span>
          </button>

          {/* Botão Dislike */}
          <button
            onClick={() => handleReaction('dislike')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              userReaction === 'dislike'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md shadow-rose-500/10'
                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{dislikesCount}</span>
            <span className="hidden sm:inline">Descurtir</span>
          </button>
        </div>

        {/* Botão Compartilhar */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-sm font-semibold transition-all"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Link Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>{sharesCount}</span>
              <span>Compartilhar</span>
            </>
          )}
        </button>
      </section>

      {/* Seção de Comentários */}
      <section className="pt-8 border-t border-zinc-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Comentários ({comments.length})
        </h3>

        {/* Formulário de Novo Comentário */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 font-bold text-sm shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário construtivo..."
                rows={3}
                className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-sm p-3.5 rounded-2xl border border-zinc-800 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {submittingComment ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Lista de Comentários */}
        <div className="space-y-4 pt-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {comment.author?.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.username}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center">
                        {(comment.author?.username || comment.author_username || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-zinc-200">
                      {comment.author?.username || comment.author_username || 'Usuário'}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed pl-9">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-zinc-500 py-6">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default PostDetail;
