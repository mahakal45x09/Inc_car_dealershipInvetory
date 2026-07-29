import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, subtitle, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
