import React from 'react';
import { FileText, Download, FileSpreadsheet, FileIcon, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Reports = () => {
  const handleExport = (type) => {
    toast.success(`${type} Report generated successfully!`);
  };

  const reportCards = [
    { title: 'Inventory Report', desc: 'Current stock levels, categories, and valuations.', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Sales Report', desc: 'Detailed breakdown of all closed vehicle sales.', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Revenue Report', desc: 'Financial analysis and revenue generation.', icon: FileIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Low Stock Report', desc: 'Vehicles that require immediate restocking.', icon: FileSpreadsheet, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Reports</h1>
        <p className="text-gray-500 font-medium mt-1">Generate and export comprehensive business reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((report, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className={`p-4 rounded-2xl ${report.bg}`}>
                <report.icon className={`w-8 h-8 ${report.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{report.desc}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => handleExport(report.title + ' CSV')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200">
                CSV
              </button>
              <button onClick={() => handleExport(report.title + ' Excel')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl transition-colors border border-green-200">
                Excel
              </button>
              <button onClick={() => handleExport(report.title + ' PDF')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-colors border border-red-200">
                PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
