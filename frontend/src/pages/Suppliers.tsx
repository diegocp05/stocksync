import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  cnpj: string | null;
  email: string | null;
  createdAt: string;
}

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    // Simulando fetch temporariamente enquanto não temos o Auth completo no Frontend
    setSuppliers([
      { id: '1', name: 'Indústria Usifresa S/A', cnpj: '12.345.678/0001-90', email: 'contato@usifresa.com', createdAt: new Date().toISOString() },
      { id: '2', name: 'Agility Fornecimentos', cnpj: '98.765.432/0001-10', email: 'vendas@agility.com', createdAt: new Date().toISOString() }
    ]);
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{supplier.name}</td>
                <td className="px-6 py-4">{supplier.cnpj || '-'}</td>
                <td className="px-6 py-4">{supplier.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
