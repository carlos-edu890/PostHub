import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import {
  User,
  Mail,
  FileText,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, deleteUserAccount } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estado para exclusão de conta via ConfirmModal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      const updatePayload = {
        username: username.trim(),
        avatar: avatar.trim() || null,
        bio: bio.trim(),
      };

      await updateUserProfile(updatePayload);
      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.detail ||
        'Não foi possível atualizar o perfil.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await deleteUserAccount();
      navigate('/login');
    } catch {
      setErrorMsg('Não foi possível excluir a conta. Tente novamente.');
      setShowDeleteModal(false);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="space-y-2 pb-6 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="w-7 h-7 text-indigo-400" />
          Configurações do Perfil
        </h1>
        <p className="text-sm text-zinc-400">
          Gerencie suas informações pessoais, foto de exibição e biografia.
        </p>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form de Perfil */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview do Avatar e Input de URL */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 text-zinc-300 font-bold text-2xl flex items-center justify-center">
                {username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-semibold text-zinc-200">
              URL da Foto de Perfil (Avatar)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/sua-foto.jpg"
                className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="text-xs text-zinc-500">
              Cole o link direto da imagem para exibir como foto de perfil.
            </p>
          </div>
        </div>

        {/* Nome de Usuário */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">
            Nome de Usuário (Username)
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu_username"
              className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        {/* E-mail (Apenas Leitura) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">
            E-mail Cadastrado (Não alterável)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-zinc-950/40 text-zinc-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-zinc-800 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-zinc-200">
            Biografia (Bio)
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escreva uma breve apresentação sobre você..."
              rows={3}
              className="w-full bg-zinc-950/70 text-zinc-100 placeholder-zinc-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        </div>

        {/* Botão Salvar Perfil */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Perfil
              </>
            )}
          </button>
        </div>
      </form>

      {/* Zona de Perigo: Exclusão de Conta */}
      <div className="pt-8 border-t border-zinc-800">
        <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-400">Zona de Perigo</h3>
              <p className="text-xs text-zinc-400">
                A exclusão da conta removerá permanentemente todos os seus dados e publicações.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-rose-600/20"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Minha Conta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão de Conta */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Excluir Conta Permanentemente"
        message="Tem certeza de que deseja excluir sua conta no PostHub? Todos os seus posts, comentários e reações serão apagados permanentemente."
        confirmText="Sim, Excluir Minha Conta"
        cancelText="Cancelar"
        onConfirm={handleConfirmDeleteAccount}
        onClose={() => setShowDeleteModal(false)}
        isDanger={true}
        loading={deletingAccount}
      />
    </div>
  );
};

export default Profile;
