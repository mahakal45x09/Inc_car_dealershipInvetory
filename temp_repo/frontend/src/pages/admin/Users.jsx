import React, { useState, useEffect } from 'react';
import { User, Shield, ShieldOff, MoreVertical } from 'lucide-react';
import api from '../../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users", err);
      setError('Failed to load user management data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (user) => {
    if (window.confirm(`Are you sure you want to ${user.is_admin ? 'revoke' : 'grant'} admin privileges for ${user.full_name}?`)) {
      try {
        await api.put(`/admin/users/${user.id}`, { is_admin: !user.is_admin });
        fetchUsers();
      } catch (err) {
        console.error("Failed to update user", err);
        alert(err.response?.data?.detail || "Failed to update user status.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">User Management</h1>
          <p className="text-gray-500">Manage all registered accounts and roles.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-12 text-center text-danger">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {user.full_name ? (
                            <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=f3f4f6&color=374151`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-secondary">{user.full_name || 'Unnamed User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.is_admin ? <Shield size={12} /> : <User size={12} />}
                        {user.is_admin ? 'Administrator' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleAdminStatus(user)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          user.is_admin 
                            ? 'text-warning hover:text-orange-700 bg-warning/10 hover:bg-warning/20' 
                            : 'text-primary hover:text-blue-700 bg-primary/10 hover:bg-primary/20'
                        }`}
                      >
                        {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
