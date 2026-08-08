import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  X,
} from 'lucide-react';

const BLOCK_TYPES = [
  {
    type: 'text',
    label: 'Texto',
    description: 'Adicionar parágrafo de texto ou conteúdo descritivo',
    icon: FileText,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    type: 'image',
    label: 'Imagem / Multimídia',
    description: 'URL de imagem ou arquivo multimídia explicativo',
    icon: ImageIcon,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    type: 'video',
    label: 'Vídeo',
    description: 'URL de vídeo incorporável (YouTube, Vimeo ou MP4)',
    icon: Video,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    type: 'link',
    label: 'Link Externo',
    description: 'Inserir link para referência externa ou artigo',
    icon: LinkIcon,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
];

const BlockEditor = ({ blocks = [], onChange }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  // Adiciona um novo bloco do tipo selecionado
  const handleAddBlock = (type, insertIndex) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      block_type: type,
      content: '',
      order: insertIndex,
    };

    const updatedBlocks = [...blocks];
    updatedBlocks.splice(insertIndex, 0, newBlock);

    // Reordena o campo order de cada bloco
    const reorderedBlocks = updatedBlocks.map((blk, idx) => ({
      ...blk,
      order: idx + 1,
    }));

    onChange(reorderedBlocks);
    setActiveMenuIndex(null);
  };

  // Atualiza o conteúdo de um bloco específico
  const handleContentChange = (index, value) => {
    const updatedBlocks = blocks.map((blk, idx) =>
      idx === index ? { ...blk, content: value } : blk
    );
    onChange(updatedBlocks);
  };

  // Remove um bloco
  const handleRemoveBlock = (index) => {
    const updatedBlocks = blocks.filter((_, idx) => idx !== index);
    const reorderedBlocks = updatedBlocks.map((blk, idx) => ({
      ...blk,
      order: idx + 1,
    }));
    onChange(reorderedBlocks);
  };

  // Move o bloco para cima ou para baixo
  const handleMoveBlock = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(index, 1);
    updatedBlocks.splice(targetIndex, 0, movedBlock);

    const reorderedBlocks = updatedBlocks.map((blk, idx) => ({
      ...blk,
      order: idx + 1,
    }));

    onChange(reorderedBlocks);
  };

  return (
    <div className="space-y-6">
      {/* Renderização dos Blocos Existentes */}
      {blocks.map((block, index) => (
        <div key={block.id || index} className="group relative">
          {/* Card do Bloco Conteúdo */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl transition-all focus-within:border-indigo-500">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {block.block_type === 'text' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                {block.block_type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                {block.block_type === 'video' && <Video className="w-3.5 h-3.5 text-rose-400" />}
                {block.block_type === 'link' && <LinkIcon className="w-3.5 h-3.5 text-amber-400" />}
                Bloco {index + 1}: {block.block_type}
              </span>

              {/* Botões de Ação do Bloco (Mover / Excluir) */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleMoveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800 transition-colors"
                  title="Mover para cima"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800 transition-colors"
                  title="Mover para baixo"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(index)}
                  className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition-colors ml-1"
                  title="Remover bloco"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Input Específico por Tipo de Bloco */}
            {block.block_type === 'text' ? (
              <textarea
                value={block.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                placeholder="Escreva o conteúdo do bloco de texto aqui... Suporta texto simples e links."
                rows={4}
                className="w-full bg-zinc-950/60 text-zinc-100 placeholder-zinc-500 text-sm p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500 resize-y"
              />
            ) : (
              <input
                type="text"
                value={block.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                placeholder={
                  block.block_type === 'image'
                    ? 'Insira a URL da imagem (ex: https://exemplo.com/imagem.png)...'
                    : block.block_type === 'video'
                    ? 'Insira a URL do vídeo (ex: https://youtube.com/watch?v=...)...'
                    : 'Insira a URL do link externo...'
                }
                className="w-full bg-zinc-950/60 text-zinc-100 placeholder-zinc-500 text-sm p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>
        </div>
      ))}

      {/* Caixa Tracejada (+) de Inserção de Novo Bloco */}
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setActiveMenuIndex(activeMenuIndex === blocks.length ? null : blocks.length)
          }
          className="w-full flex flex-col items-center justify-center p-6 bg-zinc-900/30 hover:bg-zinc-900/70 border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-center w-12 h-12 mb-2 bg-zinc-800 group-hover:bg-indigo-600 text-zinc-300 group-hover:text-white rounded-full transition-all group-hover:scale-110 shadow-md">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
            Adicionar Novo Bloco de Conteúdo
          </span>
          <span className="text-xs text-zinc-400 mt-0.5">
            Clique para escolher entre Texto, Imagem, Vídeo ou Link
          </span>
        </button>

        {/* Dropdown / Modal de Seleção de Tipo de Bloco */}
        {activeMenuIndex === blocks.length && (
          <div className="absolute left-0 right-0 top-full mt-3 z-30 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white">
                Selecione o Tipo de Bloco a Inserir
              </h4>
              <button
                type="button"
                onClick={() => setActiveMenuIndex(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BLOCK_TYPES.map((bt) => {
                const IconComponent = bt.icon;
                return (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() => handleAddBlock(bt.type, blocks.length)}
                    className="flex items-start gap-3 p-3 text-left bg-zinc-950/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group"
                  >
                    <div
                      className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-lg border ${bt.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {bt.label}
                      </span>
                      <span className="text-xs text-zinc-400 leading-tight">
                        {bt.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
