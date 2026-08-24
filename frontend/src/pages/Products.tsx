import { useEffect, useState } from 'react';
import { PackagePlus, Edit2, Trash2, X, Package } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  supplierId: string;
}

interface Supplier {
  id: string;
  name: string;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    currentStock: 0,
    minStock: 0,
    unitPrice: 0,
    supplierId: ''
  });

  async function loadData() {
    try {
      setIsLoading(true);
      const [prodRes, suppRes] = await Promise.all([
        api.get('/products'),
        api.get('/suppliers')
      ]);
      setProducts(prodRes.data);
      setSuppliers(suppRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        description: '', // Descrição não vem no list principal por padrão, podemos deixar vazio no edit por simplicidade do lab
        currentStock: product.currentStock,
        minStock: product.minStock,
        unitPrice: product.unitPrice,
        supplierId: product.supplierId || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ sku: '', name: '', description: '', currentStock: 0, minStock: 0, unitPrice: 0, supplierId: '' });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.supplierId) {
      toast.error('Selecione um fornecedor para este produto.');
      return;
    }

    const payload = {
      ...formData,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      unitPrice: Number(formData.unitPrice),
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        toast.success('Produto cadastrado com sucesso!');
      }
      closeModal();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar produto.');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir produto.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventário de Produtos</h2>
          <p className="text-zinc-500 mt-1">Gerencie seu catálogo de itens</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <PackagePlus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Nome</th>
              <th className="px-6 py-4 font-medium">Preço</th>
              <th className="px-6 py-4 font-medium">Estoque</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Carregando produtos...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="h-8 w-8 text-zinc-400" />
                    <p>Nenhum produto cadastrado.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.currentStock < product.minStock;
                return (
                  <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{product.sku}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">R$ {product.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        {product.currentStock}
                      </span>
                      <span className="text-xs text-zinc-400 ml-1">/ {product.minStock} min</span>
                    </td>
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
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors ml-2"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">SKU *</label>
                  <input 
                    required type="text" 
                    value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome do Produto *</label>
                  <input 
                    required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fornecedor *</label>
                <select
                  required
                  value={formData.supplierId}
                  onChange={e => setFormData({...formData, supplierId: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="" disabled>Selecione um fornecedor...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Preço (R$) *</label>
                  <input 
                    required type="number" step="0.01" min="0"
                    value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estoque Atual *</label>
                  <input 
                    required type="number" min="0"
                    value={formData.currentStock} onChange={e => setFormData({...formData, currentStock: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estoque Mín. *</label>
                  <input 
                    required type="number" min="0"
                    value={formData.minStock} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
