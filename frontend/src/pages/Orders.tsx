import { useEffect, useState } from 'react';
import { FileText, Play, Download } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  supplier: {
    name: string;
    cnpj: string | null;
  };
  _count: {
    items: number;
  };
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  async function loadOrders() {
    try {
      setIsLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Erro ao carregar ordens de fornecimento.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleGenerateOrders() {
    try {
      setIsGenerating(true);
      const response = await api.post('/orders/generate');
      if (response.data.ordersGenerated > 0) {
        toast.success(response.data.message);
        loadOrders();
      } else {
        toast.success('Nenhuma ordem gerada. Os estoques estão regulares.', {
          icon: '✅'
        });
      }
    } catch (error) {
      toast.error('Erro ao tentar gerar ordens.');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownloadPDF(orderId: string, orderNumber: string) {
    const token = localStorage.getItem('@StockSync:token');
    
    toast.loading('Gerando PDF...', { id: 'pdf-toast' });

    fetch(`http://localhost:3333/api/orders/${orderId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ordem_compra_${orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success('PDF baixado com sucesso!', { id: 'pdf-toast' });
      })
      .catch(() => {
        toast.error('Falha ao baixar o arquivo PDF.', { id: 'pdf-toast' });
      });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Ordens de Fornecimento</h2>
          <p className="text-sm text-zinc-500 mt-1">Gerencie as ordens de compra emitidas automaticamente (PDF)</p>
        </div>
        
        <button 
          onClick={handleGenerateOrders}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Play className="h-4 w-4" fill="currentColor" />
          {isGenerating ? 'Analisando Estoque...' : 'Rodar Motor de Automação'}
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Ordem</th>
              <th className="px-6 py-4 font-medium">Fornecedor</th>
              <th className="px-6 py-4 font-medium">Itens</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  Carregando histórico de ordens...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-zinc-400" />
                    <p>Nenhuma ordem gerada ainda.</p>
                    <p className="text-xs">Rode o Motor de Automação para escanear seu estoque.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.supplier.name}</td>
                  <td className="px-6 py-4">{order._count.items} tipos de produto</td>
                  <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                    R$ {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownloadPDF(order.id, order.orderNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Baixar PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
