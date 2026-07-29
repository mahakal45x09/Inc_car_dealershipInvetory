import React, { useState } from 'react';
import { Search, Download, Filter, MoreVertical, Edit2, Ban, Trash2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const mockUsers = [
  { id: 'usr_1', name: 'James Wishers', email: 'james@example.com', role: 'Customer', status: 'Active', joined: '2023-11-12' },
  { id: 'usr_2', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Customer', status: 'Active', joined: '2023-12-05' },
  { id: 'usr_3', name: 'Admin Root', email: 'admin@dealership.com', role: 'Admin', status: 'Active', joined: '2023-01-01' },
  { id: 'usr_4', name: 'Michael Scott', email: 'michael@dunder.com', role: 'Customer', status: 'Disabled', joined: '2024-02-14' },
  { id: 'usr_5', name: 'Dwight Schrute', email: 'dwight@beet.com', role: 'Customer', status: 'Active', joined: '2024-03-01' },
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const handleAction = (action, userName) => {
    toast.success(`${action} applied for ${userName}`);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage platform users, roles, and account statuses.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-all border border-gray-200">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-600">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleAction('Update Role', user.name)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Change Role">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction('Account Status Toggled', user.name)} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors" title="Disable/Enable">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction('User Deleted', user.name)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
