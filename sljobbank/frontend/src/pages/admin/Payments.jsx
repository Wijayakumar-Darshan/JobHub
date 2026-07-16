import { useEffect, useState } from 'react';
import { paymentApi } from '@/api';
import { CreditCard, DollarSign, Filter, Search, Calendar } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getAll({ 
        status: status || undefined, 
        size: 100 
      });
      setPayments(res.data.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [status]);

  const filteredPayments = payments.filter(p => 
    p.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      FAILED: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-80 bg-gray-200 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#0A2E1C]" />
            Payment History
          </h1>
          <p className="text-gray-600 mt-1">Monitor all subscription and transaction activity across the platform</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-semibold text-emerald-700">
              LKR {totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <div className="text-sm text-gray-500">Transactions</div>
            <div className="text-2xl font-semibold text-gray-900">{filteredPayments.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]/30"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent focus:outline-none text-sm font-medium"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Card View */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-700">No payments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 font-mono text-sm text-gray-600">{p.reference}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{p.user?.fullName || '—'}</td>
                    <td className="px-6 py-5">
                      <span className="font-semibold text-emerald-700">
                        LKR {p.amount?.toLocaleString() || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600 capitalize">{p.method || '—'}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-4 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {new Date(p.paymentDate).toLocaleDateString('en-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        Showing {filteredPayments.length} of {payments.length} payments
      </div>
    </div>
  );
}