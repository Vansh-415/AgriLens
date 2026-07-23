import { motion } from 'framer-motion';

export function LoadingOverlay({ isLoading, message = 'Loading...' }: { isLoading: boolean; message?: string }) {
  if (!isLoading) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <svg className="w-10 h-10 animate-spin text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {message && <p className="mt-4 text-sm font-medium text-earth-600 animate-pulse">{message}</p>}
    </motion.div>
  );
}
