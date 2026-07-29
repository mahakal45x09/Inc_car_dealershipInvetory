import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export default function RentalRequests() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // Fetch all bookings (Admin only route)
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setError('Failed to load rental requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this rental request?")) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        fetchBookings(); // Refresh the list
      } catch (err) {
        console.error("Failed to cancel booking", err);
        alert(err.response?.data?.detail || "Failed to cancel booking.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Rental Requests</h1>
          <p className="text-gray-500">Manage all customer vehicle bookings</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading requests...</div>
        ) : error ? (
          <div className="p-12 text-center text-danger">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No rental requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary">{booking.user?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary">{booking.vehicle?.make} {booking.vehicle?.model}</div>
                      <div className="text-xs text-gray-500">${booking.total_price.toLocaleString()} Total</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>From: {new Date(booking.start_date).toLocaleDateString()}</div>
                      <div>To: {new Date(booking.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-success/10 text-success' : 
                        booking.status === 'cancelled' ? 'bg-danger/10 text-danger' : 
                        'bg-warning/10 text-warning'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle size={12} />}
                        {booking.status === 'cancelled' && <XCircle size={12} />}
                        {booking.status === 'pending' && <Clock size={12} />}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleCancel(booking.id)} 
                          className="text-xs font-medium text-danger hover:text-red-700 bg-danger/5 hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
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
