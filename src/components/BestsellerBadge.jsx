import React from 'react';
<<<<<<< HEAD
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
=======
import { Star } from 'lucide-react';

const BestsellerBadge = ({ small = false }) => {
  const sizeText = small ? 'text-[10px] px-2 py-[1px]' : 'text-[11px] px-2.5 py-[2px]';
  return (
    <div className="relative inline-flex items-center">
      {/* subtle static ring */}
      <div className="absolute -inset-[2px] rounded-full pointer-events-none">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(251,146,60,0.22), rgba(255,255,255,0.08), rgba(251,146,60,0.22))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 0px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 0px))'
          }}
        />
      </div>
      {/* badge body */}
      <div className={`bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full shadow-md pointer-events-none flex items-center gap-1 border border-white/10 ${sizeText}`}>
        <Star className="w-3.5 h-3.5" />
        <span>#1 Best Seller</span>
      </div>
    </div>
  );
};
>>>>>>> 170550e (init: project baseline)

export default BestsellerBadge;