import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import postService from '../services/postService';
import BlockEditor from '../components/BlockEditor';
import { Edit3, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await postService.getPostById(id);
        setTitle(postData.title || '');
        if (Array.isArray(postData.blocks) && postData.blocks.length > 0) {
          setBlocks(
            postData.blocks.map((blk, idx) => ({
              id: blk.id || `block-existing-${idx}`,
              block_type: blk.block_type || 'text',
              content: blk.content || '',
              order: blk.order || idx + 1,
            }))
          );
        } else {
          setBlocks([
            { id: `block-${Date.now()}-1`, block_type: 'text', content: '', order: 1 },
          ]);
        }
      } catch {
        setError('Não foi possível carregar os dados deste post para edição.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor, informe um título para o seu post.');
      return;
    }

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

      await postService.updatePost(id, postData);
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.detail ||
        'Ocorreu um erro ao atualizar o post.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] gap-3 text-zinc-400">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium">Carregando post para edição...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <Link
          to="/meus-posts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Meus Posts
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Edit3 className="w-7 h-7 text-indigo-400" />
          Editar Post
        </h1>
        <p className="text-sm text-zinc-400">
          Altere o título ou modifique os blocos de conteúdo da sua publicação.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campo Título do Post */}
        <div className="space-y-2">
          <label htmlFor="edit-title" className="block text-sm font-bold text-zinc-200">
            Título do Post
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do post..."
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

        {/* Ações */}
        <div className="flex justify-end pt-4 border-t border-zinc-800 gap-4">
          <Link
            to="/meus-posts"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm rounded-xl transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
