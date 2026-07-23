import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
