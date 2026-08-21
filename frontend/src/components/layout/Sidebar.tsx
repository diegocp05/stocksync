import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Users, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/products', label: 'Produtos', icon: Package },
    { href: '/suppliers', label: 'Fornecedores', icon: Users },
    { href: '/orders', label: 'Ordens', icon: ShoppingCart },
  ];

  return (
    <div className="h-full bg-zinc-950 text-zinc-100 w-64 flex flex-col border-r border-zinc-800">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Package className="h-6 w-6 mr-3 text-blue-500" />
        <h1 className="text-lg font-bold tracking-tight text-white">StockSync</h1>
      </div>
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        {routes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          )
        })}
      </div>
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white w-full transition-colors">
          <Settings className="h-4 w-4" />
          Configurações
        </button>
      </div>
    </div>
  );
}
