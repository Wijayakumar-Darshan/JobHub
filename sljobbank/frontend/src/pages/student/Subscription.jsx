import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { subscriptionApi } from '@/api'
import useAuthStore from '/src/store/authStore'

export default function SubscriptionPage() {
  const { user, updateUser } = useAuthStore()
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  function load() {
    subscriptionApi.getMyStatus().then(res => setStatus(res.data.data))
    subscriptionApi.getHistory().then(res => setHistory(res.data.data || []))
  }
  useEffect(() => { load() }, [])

  async function subscribe(plan) {
    setLoading(true)
    try {
      const res = await subscriptionApi.initiatePayment({ plan })
      const payment = res.data.data
      // In production, redirect to PayHere's checkout here using payment.reference.
      // For this build, we simulate the gateway confirming payment:
      await subscriptionApi.verifyPayment({ paymentId: payment.id })
      updateUser({ subscriptionType: 'PAID' })
      toast.success('Subscription activated! 🎉')
      load()
    } catch {
      toast.error('Payment could not be completed.')
    } finally { setLoading(false) }
  }

  if (!status) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A2E1C] mx-auto"></div>
        <p className="text-sm text-gray-400 mt-3">Loading subscription details…</p>
      </div>
    </div>
  )

  const isPaid = user?.subscriptionType === 'PAID'
  const isPaidMode = status.paidModeEnabled

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>⭐</span> Subscription
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isPaidMode
            ? 'An active subscription is required for full access to all features.'
            : 'The platform is currently free for all students – subscription is optional.'}
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
              isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {isPaid ? '✅' : '📋'}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Current Plan</div>
              <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {isPaid ? 'Premium Plan' : 'Free Plan'}
                {isPaid && (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-0.5">
                {isPaid
                  ? 'Access to all career guidance and job listings'
                  : 'Basic access – upgrade to unlock full potential'}
              </div>
            </div>
          </div>
          {isPaid && (
            <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Pricing Plans */}
      {!isPaid && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase">Monthly</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Flexible</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              LKR {status.monthlyPrice?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 mb-4">billed monthly</div>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">✅ Full access to all job listings</li>
              <li className="flex items-center gap-2">✅ Career cluster guidance</li>
              <li className="flex items-center gap-2">✅ Qualification path recommendations</li>
              <li className="flex items-center gap-2">✅ Institute directory</li>
            </ul>
            <button
              onClick={() => subscribe('MONTHLY')}
              disabled={loading}
              className="w-full btn-primary py-2.5 text-sm font-medium rounded-lg"
            >
              {loading ? 'Processing…' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly Plan (Best Value) */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-[#E8A200] p-6 hover:shadow-lg transition-shadow duration-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#E8A200] text-white text-xs font-bold px-4 py-0.5 rounded-full">
              BEST VALUE
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase">Yearly</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Save 20%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              LKR {status.yearlyPrice?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 mb-4">billed annually</div>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">✅ Everything in Monthly</li>
              <li className="flex items-center gap-2">✅ 2 months free compared to monthly</li>
              <li className="flex items-center gap-2">✅ Priority support</li>
              <li className="flex items-center gap-2">✅ Early access to new features</li>
            </ul>
            <button
              onClick={() => subscribe('YEARLY')}
              disabled={loading}
              className="w-full btn-accent py-2.5 text-sm font-medium rounded-lg"
            >
              {loading ? 'Processing…' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <span>📜</span> Payment History
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No payment history yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-6 py-3 text-gray-700 font-mono text-xs">{p.reference}</td>
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(p.paymentDate).toLocaleDateString('en-LK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-900">
                        LKR {p.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {p.status === 'COMPLETED' ? '✅ Completed' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
        All prices are in Sri Lankan Rupees (LKR). Subscription auto-renews until cancelled.
        {!isPaid && isPaidMode && ' Subscribe now to unlock full access.'}
      </div>
    </div>
  )
}


