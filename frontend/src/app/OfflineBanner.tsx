import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium z-50 relative"
        >
          <WifiOff className="h-4 w-4" />
          You are currently offline. Some features may be unavailable.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
