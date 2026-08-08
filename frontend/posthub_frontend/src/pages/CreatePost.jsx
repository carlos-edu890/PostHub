import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import postService from '../services/postService';
import BlockEditor from '../components/BlockEditor';
import { PenSquare, ArrowLeft, Send, AlertCircle } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([
    { id: `block-${Date.now()}-1`, block_type: 'text', content: '', order: 1 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor, informe um título para o seu post.');
      return;
    }

    // Filtra blocos vazios ou garante formato válido
    const validBlocks = blocks
      .filter((b) => b.content && b.content.trim() !== '')
      .map((b, idx) => ({
        block_type: b.block_type,
        content: b.content.trim(),
        order: idx + 1,
      }));

    if (validBlocks.length === 0) {
      setError('Adicione pelo menos um bloco de conteúdo com texto ou mídia.');
      return;
    }

    try {
      setSubmitting(true);
      const postData = {
        title: title.trim(),
        blocks: validBlocks,
      };

      const createdPost = await postService.createPost(postData);
      navigate(`/posts/${createdPost.id}`);
    } catch (err) {
      const msg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.detail ||
        'Ocorreu um erro ao publicar o post. Tente novamente.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <PenSquare className="w-7 h-7 text-indigo-400" />
          Criar Novo Post
        </h1>
        <p className="text-sm text-zinc-400">
          Componha seu artigo adicionando blocos dinâmicos de texto, imagens, vídeos ou links.
        </p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campo Título do Post */}
        <div className="space-y-2">
          <label htmlFor="post-title" className="block text-sm font-bold text-zinc-200">
            Título do Post
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite um título impactante e provocativo..."
            className="w-full bg-zinc-900 text-white placeholder-zinc-500 text-xl font-bold p-4 rounded-2xl border border-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            required
          />
        </div>

        {/* Editor de Blocos Conteúdo */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-200">
            Blocos de Conteúdo do Post
          </label>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {/* Ação de Publicar */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publicar Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
