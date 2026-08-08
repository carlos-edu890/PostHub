import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  User,
  Calendar,
} from 'lucide-react';

const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!post) return null;

  // Extrai autor (pode vir como objeto author ou propriedades diretas)
  const authorName = post.author?.username || post.author_username || 'Autor Anônimo';
  const authorAvatar = post.author?.avatar || post.author_avatar || null;

  // Formatação de data amigável
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Obtém o texto prévia extraído dos blocos de conteúdo
  const getPreviewText = () => {
    if (post.preview_text) return post.preview_text;
    if (Array.isArray(post.blocks) && post.blocks.length > 0) {
      const textBlock = post.blocks.find((b) => b.block_type === 'text');
      if (textBlock && textBlock.content) {
        return textBlock.content;
      }
    }
    return 'Clique para ler o conteúdo completo deste post...';
  };

  const handleCardClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <article className="group relative flex flex-col justify-between p-5 bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all duration-200 shadow-md hover:shadow-xl">
      <div>
        {/* Cabeçalho do Card: Autor e Data */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-9 h-9 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm">
                {authorName.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </div>
            )}
            <div>
              <span className="block text-sm font-semibold text-zinc-200 hover:text-indigo-400 transition-colors">
                {authorName}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <Calendar className="w-3 h-3" />
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>

          {/* Badge de Reações Rápidas ou Destaque */}
          {post.is_top_liked && (
            <span className="px-2.5 py-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full">
              Mais Curtido
            </span>
          )}
        </div>

        {/* Título do Post */}
        <h2
          onClick={handleCardClick}
          className="text-lg font-bold text-white group-hover:text-indigo-400 cursor-pointer transition-colors line-clamp-2 mb-2"
        >
          {post.title}
        </h2>

        {/* Prévia do Conteúdo (Exatamente 2 linhas de texto + ...) */}
        <p
          onClick={handleCardClick}
          className="text-sm text-zinc-400 cursor-pointer line-clamp-2 leading-relaxed mb-4"
        >
          {getPreviewText()}
        </p>
      </div>

      {/* Rodapé do Card: Métricas e Ações */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
        {/* Métricas de Engajamento */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors" title="Curtidas">
            <ThumbsUp className="w-3.5 h-3.5" />
            {post.likes_count ?? post.likes ?? 0}
          </span>
          <span className="flex items-center gap-1.5 hover:text-rose-400 transition-colors" title="Descurtidas">
            <ThumbsDown className="w-3.5 h-3.5" />
            {post.dislikes_count ?? post.dislikes ?? 0}
          </span>
          <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors" title="Comentários">
            <MessageSquare className="w-3.5 h-3.5" />
            {post.comments_count ?? post.comments ?? 0}
          </span>
          {(post.shares_count !== undefined || post.shares !== undefined) && (
            <span className="flex items-center gap-1.5 hover:text-sky-400 transition-colors" title="Compartilhamentos">
              <Share2 className="w-3.5 h-3.5" />
              {post.shares_count ?? post.shares ?? 0}
            </span>
          )}
        </div>

        {/* Botões de Ação Direta para Meus Posts */}
        {showActions ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit && onEdit(post)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg border border-indigo-500/20 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={() => onDelete && onDelete(post)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg border border-rose-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </div>
        ) : (
          <button
            onClick={handleCardClick}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Ler post &rarr;
          </button>
        )}
      </div>
    </article>
  );
};

export default PostCard;
