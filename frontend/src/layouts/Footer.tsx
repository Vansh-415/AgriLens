import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-earth-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1120] text-earth-600 dark:text-slate-300 py-8 px-6 lg:px-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary-50 dark:bg-primary-600/20 p-1.5 rounded-lg border border-primary-100 dark:border-primary-500/30 flex items-center justify-center transition-colors">
            <Leaf className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-bold text-xl tracking-tight text-earth-900 dark:text-white transition-colors">AgriLens</span>
        </div>
        
        <p className="text-sm text-earth-500 dark:text-slate-400 transition-colors">
          &copy; {new Date().getFullYear()} AgriLens. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-earth-500 dark:text-slate-400">
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}


