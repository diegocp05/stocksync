import { useEffect, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        toast.error('Erro ao carregar produtos.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventário de Produtos</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <PackagePlus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Nome do Produto</th>
              <th className="px-6 py-4 font-medium">Estoque Atual</th>
              <th className="px-6 py-4 font-medium">Mínimo</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Carregando produtos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.currentStock < product.minStock;
                return (
                  <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{product.sku}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.minStock}</td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-300">
                          Baixo Estoque
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
