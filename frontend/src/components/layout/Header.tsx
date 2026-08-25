import { Search, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6">
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md w-96">
        <Search className="h-4 w-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Buscar produtos, ordens..." 
          className="bg-transparent border-none outline-none ml-2 text-sm w-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/settings" className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
          <UserCircle className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </Link>
      </div>
    </header>
  );
}
