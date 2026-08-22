import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Suppliers } from './pages/Suppliers';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

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
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <AuthProvider>
      <div className="dark">
        <Toaster position="top-right" toastOptions={{ className: 'dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800' }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
