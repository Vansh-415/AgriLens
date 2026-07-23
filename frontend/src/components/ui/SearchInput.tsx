import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ className, onClear, value, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center w-full max-w-sm", className)}>
      <Search className="absolute left-3 w-4 h-4 text-earth-400" />
      <input
        type="text"
        value={value}
        className="w-full h-10 pl-9 pr-9 text-sm bg-white border border-earth-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-earth-400"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 p-0.5 rounded-full hover:bg-earth-100 text-earth-400 hover:text-earth-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
