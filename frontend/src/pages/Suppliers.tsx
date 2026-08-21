import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  cnpj: string | null;
  email: string | null;
  createdAt: string;
}

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const response = await api.get('/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        toast.error('Erro ao carregar fornecedores.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSuppliers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Fornecedores</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Fornecedor</th>
              <th className="px-6 py-4 font-medium">CNPJ</th>
              <th className="px-6 py-4 font-medium">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                  Carregando fornecedores...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum fornecedor cadastrado.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{supplier.name}</td>
                  <td className="px-6 py-4">{supplier.cnpj || '-'}</td>
                  <td className="px-6 py-4">{supplier.email || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
