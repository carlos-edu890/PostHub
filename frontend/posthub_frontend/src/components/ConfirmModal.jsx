import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Confirmar Ação',
  message = 'Tem certeza de que deseja prosseguir com esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  isDanger = false,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-all">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl ${
              isDanger
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
            }`}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm rounded-xl border border-zinc-700 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 font-medium text-sm text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
