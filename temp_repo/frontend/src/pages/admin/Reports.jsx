import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

export default function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('sales');

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report generated successfully! A download link will be emailed to you.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-1">Export Reports</h1>
        <p className="text-gray-500">Generate and download comprehensive data reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Report Generator */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-secondary mb-6">Generate New Report</h3>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Report Type</label>
              <div className="relative">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="sales">Sales & Revenue</option>
                  <option value="rentals">Rental History</option>
                  <option value="inventory">Inventory Status</option>
                  <option value="users">User Activity</option>
                </select>
                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Start Date</label>
                <div className="relative">
                  <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">End Date</label>
                <div className="relative">
                  <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Format</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value="pdf" defaultChecked className="text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-700">PDF Document</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value="csv" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-700">CSV Excel</span>
                </label>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isGenerating}
                className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  isGenerating ? 'bg-primary/50 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/20'
                }`}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <><Download size={18} /> Generate Report</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Reports */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-secondary">Recent Exports</h3>
            <button className="text-gray-400 hover:text-primary"><Filter size={18} /></button>
          </div>
          
          <div className="flex-1 p-6 space-y-4">
            {[
              { name: 'Q3 Sales Summary', date: 'Oct 15, 2026', type: 'PDF', size: '2.4 MB' },
              { name: 'Monthly Inventory Status', date: 'Oct 01, 2026', type: 'CSV', size: '156 KB' },
              { name: 'Customer Activity Log', date: 'Sep 28, 2026', type: 'CSV', size: '842 KB' },
              { name: 'Q2 Rental History', date: 'Jul 05, 2026', type: 'PDF', size: '1.8 MB' },
            ].map((report, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg flex items-center justify-center ${
                    report.type === 'PDF' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">{report.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{report.date} • {report.size}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
