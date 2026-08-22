import { useEffect, useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Users, 
  ShoppingCart, 
  DollarSign 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface DashboardMetrics {
  cards: {
    totalProducts: number;
    lowStockCount: number;
    totalSuppliers: number;
    totalOrders: number;
    totalStockValue: number;
  };
  charts: {
    productsBySupplier: { name: string; quantidade: number }[];
    ordersValue: { ordem: string; valor: number }[];
  };
}

export function DashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await api.get('/dashboard/metrics');
        setMetrics(response.data);
      } catch (error) {
        toast.error('Erro ao carregar métricas do dashboard.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-zinc-500 animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Carregando métricas...
        </div>
      </div>
    );
  }

  const { cards, charts } = metrics;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard</h2>
        <p className="text-zinc-500 mt-1">Visão geral e métricas do seu sistema de estoque.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total de Produtos</h3>
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{cards.totalProducts}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Estoque Crítico</h3>
            <div className="h-10 w-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{cards.lowStockCount}</span>
            <span className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
              Requer atenção
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Ordens Emitidas</h3>
            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{cards.totalOrders}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Patrimônio (Estoque)</h3>
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cards.totalStockValue)}
            </span>
          </div>
        </div>

      </div>

      {/* Área de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Produtos por Fornecedor */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Top Fornecedores</h3>
            <p className="text-sm text-zinc-500">Fornecedores com mais produtos cadastrados</p>
          </div>
          
          <div className="h-72 w-full">
            {charts.productsBySupplier.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.productsBySupplier} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Sem dados suficientes.
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 2: Evolução de Gastos */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Evolução de Compras</h3>
            <p className="text-sm text-zinc-500">Valor total das últimas ordens de fornecimento</p>
          </div>
          
          <div className="h-72 w-full">
            {charts.ordersValue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.ordersValue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="ordem" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, fill: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Nenhuma ordem gerada ainda.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
