import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast } from '../../types/toast';
import { useEffect } from 'react';

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[toast.type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-earth-900">{toast.title}</p>
            {toast.message && <p className="mt-1 text-sm text-earth-500">{toast.message}</p>}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-earth-400 hover:text-earth-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => onRemove(toast.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end px-4 py-6 sm:items-start sm:p-6 space-y-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
