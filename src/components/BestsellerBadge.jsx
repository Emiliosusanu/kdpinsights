import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BestsellerBadge = ({ small = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
    className={cn(
      "absolute z-10",
      small ? "-top-1.5 -left-1.5" : "-top-2 -left-2"
    )}
  >
    <div className={cn(
      "bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-lg pointer-events-none transform -rotate-12",
      small ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"
    )}>
      #1 Best Seller
    </div>
  </motion.div>
);

export default BestsellerBadge;