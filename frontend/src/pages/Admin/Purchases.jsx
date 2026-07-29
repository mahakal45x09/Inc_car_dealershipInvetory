import React, { useState } from 'react';
import { Search, Download, Calendar, ArrowUpRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPurchases = [
  { id: 'ORD-5821', customer: 'James Wishers', vehicle: 'Tesla Model S Plaid', amount: 129000, qty: 1, date: '2024-07-20', status: 'Completed' },
  { id: 'ORD-5822', customer: 'Sarah Connor', vehicle: 'BMW X5', amount: 72000, qty: 1, date: '2024-07-21', status: 'Processing' },
  { id: 'ORD-5823', customer: 'Dwight Schrute', vehicle: 'Toyota Tacoma', amount: 45000, qty: 2, date: '2024-07-22', status: 'Completed' },
  { id: 'ORD-5824', customer: 'Michael Scott', vehicle: 'Porsche 911', amount: 135000, qty: 1, date: '2024-07-22', status: 'Pending' },
  { id: 'ORD-5825', customer: 'Jim Halpert', vehicle: 'Audi Q8', amount: 82000, qty: 1, date: '2024-07-23', status: 'Completed' },
];

const Purchases = () => {
  const [purchases] = useState(mockPurchases);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Purchase Management</h1>
          <p className="text-gray-500 font-medium mt-1">Review all global vehicle transactions and orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-200">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex gap-4 items-center">
          <div className="relative max-w-md flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium outline-none"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200/50 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last 30 Days
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((purchase, idx) => (
                <motion.tr 
                  key={purchase.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-primary-600">{purchase.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{purchase.customer}</p>
                    <p className="text-xs font-medium text-gray-500">{purchase.date}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-700">
                    {purchase.vehicle} <span className="text-xs text-gray-400 font-bold ml-1">x{purchase.qty}</span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-gray-900">${purchase.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      purchase.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      purchase.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-500 hover:shadow-sm rounded-lg transition-all inline-flex justify-center items-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
