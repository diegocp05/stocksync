import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Shield, Key } from 'lucide-react';

export function Settings() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Configurações</h2>
        <p className="text-zinc-500 mt-1">Gerencie as informações do seu perfil de usuário</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-8">
        
        {/* Seção do Perfil */}
        <div className="flex items-start gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-sm">
            <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user?.name}</h3>
              <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                Administrador do Sistema
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Email Cadastrado</label>
                <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Função / Cargo</label>
                <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                  Admin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Segurança */}
        <div className="space-y-4 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Key className="h-5 w-5 text-zinc-400" />
            Segurança da Conta
          </h3>
          <p className="text-sm text-zinc-500">
            A senha da conta só pode ser alterada contatando o suporte do sistema para redefinição por link.
          </p>
          <button 
            disabled
            className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-900 rounded-lg cursor-not-allowed border border-zinc-200 dark:border-zinc-800"
          >
            Redefinir Senha
          </button>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Desconectar</h3>
          <p className="text-sm text-zinc-500">
            Encerre a sua sessão neste dispositivo.
          </p>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </button>
        </div>

      </div>
    </div>
  );
}
