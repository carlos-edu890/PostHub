import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';

const ErrorState = ({
  title = 'Algo deu errado',
  message = 'Tente novamente em instantes.',
  onRetry,
  retryLabel = 'Tentar novamente',
  linkTo = '/',
  linkLabel = 'Voltar para a página inicial',
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center shadow-lg shadow-rose-500/10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="max-w-md text-sm text-zinc-300">{message}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <RotateCcw className="h-4 w-4" />
            {retryLabel}
          </button>
        )}
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
