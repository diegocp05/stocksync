import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';

function DashboardHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Visão Geral</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total de Produtos</h3>
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-bold text-zinc-900 dark:text-white">
            1,245
          </div>
        </div>
        {/* Adicionaremos mais cards aqui depois */}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="dark"> {/* Forçando Dark Mode provisoriamente para vermos o design premium */}
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<div className="text-zinc-900 dark:text-white">Página de Produtos em breve...</div>} />
            <Route path="suppliers" element={<div className="text-zinc-900 dark:text-white">Página de Fornecedores em breve...</div>} />
            <Route path="orders" element={<div className="text-zinc-900 dark:text-white">Página de Ordens em breve...</div>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
