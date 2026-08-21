import { Bell, Search, UserCircle } from 'lucide-react';

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
        <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-950"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-300 dark:border-zinc-700">
          <UserCircle className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
