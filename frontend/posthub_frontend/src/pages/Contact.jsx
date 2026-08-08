import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-1">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Entre em Contato
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Dúvidas, sugestões de melhoria ou feedback? Envie uma mensagem para nossa equipe.
        </p>
      </div>

      {sent && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Mensagem enviada com sucesso! Agradecemos o seu contato.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">Seu Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome completo..."
            className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">Seu E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com..."
            className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua mensagem aqui..."
            rows={5}
            className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all resize-y"
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
