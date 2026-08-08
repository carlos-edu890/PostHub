import React from 'react';
import { BookOpen, Sparkles, Users, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sobre o <span className="text-indigo-400">PostHub</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Uma plataforma moderna de publicação de conteúdo inspirada no Medium, projetada para conectar escritores, pensadores e leitores apaixonados.
        </p>
      </div>

      {/* Grid de Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Editor Dinâmico</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Escreva artigos ricos compostos por blocos modulares de texto, imagens, vídeos e links externos.
          </p>
        </div>

        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Engajamento Direto</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Reaja com curtidas e descurtidas, participe das discussões nos comentários e compartilhe ideias.
          </p>
        </div>

        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Segurança & Controle</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Controle total sobre suas publicações e dados pessoais com autenticação JWT e rotas protegidas.
          </p>
        </div>
      </div>

      <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-center space-y-4">
        <Heart className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Desenvolvido com excelência tecnológica</h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Construído utilizando React 19, Tailwind CSS v4, React Router DOM v7 e backend Django REST Framework.
        </p>
      </div>
    </div>
  );
};

export default About;
