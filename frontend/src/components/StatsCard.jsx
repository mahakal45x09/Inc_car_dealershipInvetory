import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatsCard = ({ title, value, icon: Icon, trend, color, data, delay }) => {
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.4 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
          
          <div className="flex items-center gap-2 mt-4">
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs font-medium text-gray-400">vs last month</span>
          </div>
        </div>
        
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-sm border border-white/50 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-').replace('-50', '-500')}`} />
        </div>
      </div>

      {/* Background Sparkline Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#22c55e' : '#ef4444'} 
              strokeWidth={2} 
              fill={`url(#gradient-${title.replace(/\s+/g, '')})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StatsCard;
