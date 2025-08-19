import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const trendConfig = {
  up: {
    Icon: ArrowUp,
    color: 'text-green-400',
  },
  down: {
    Icon: ArrowDown,
    color: 'text-red-400',
  },
  stable: {
    Icon: Minus,
    color: 'text-gray-500',
  },
};

const TrendIndicator = ({ trend }) => {
  if (!trend || !trendConfig[trend]) {
    return <div className="w-4 h-4" />; // Placeholder for alignment
  }

  const { Icon, color } = trendConfig[trend];

  return (
    <motion.div
      key={trend}
      initial={{ opacity: 0, y: 5, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.8 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center ${color}`}
    >
      <Icon className="w-5 h-5" />
    </motion.div>
  );
};

export default TrendIndicator;