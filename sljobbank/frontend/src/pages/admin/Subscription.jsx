import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '@/api';
import { ToggleLeft, ToggleRight, Save, RefreshCw, Eye } from 'lucide-react';

export default function SubscriptionPage() {
  const [settings, setSettings] = useState(null);
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [yearlyPrice, setYearlyPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const load = async () => {
    try {
      const res = await settingsApi.get();
      const s = res.data.data;
      setSettings(s);
      setMonthlyPrice(s.monthlyPrice || '');
      setYearlyPrice(s.yearlyPrice || '');
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const togglePaidMode = async () => {
    setToggling(true);
    try {
      await settingsApi.togglePaidMode();
      toast.success(settings.paidModeEnabled ? 'Switched to Free Mode' : 'Paid Mode Activated');
      load();
    } catch {
      toast.error('Failed to toggle mode');
    } finally {
      setToggling(false);
    }
  };

  const savePricing = async () => {
    if (!monthlyPrice || !yearlyPrice) {
      return toast.error('Please enter both monthly and yearly prices');
    }

    setSaving(true);
    try {
      await settingsApi.updatePricing({
        monthlyPrice: Number(monthlyPrice),
        yearlyPrice: Number(yearlyPrice),
      });
      toast.success('Pricing updated successfully');
      load();
    } catch {
      toast.error('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2E1C] mx-auto" />
          <p className="text-sm text-gray-400 mt-4">Loading subscription settings...</p>
        </div>
      </div>
    );
  }

  const isPaid = settings.paidModeEnabled;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          💳 Subscription Management
        </h1>
        <p className="text-gray-600 mt-2">
          Control whether students need a subscription and set pricing tiers.
        </p>
      </div>

      {/* Mode Toggle Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-colors ${
              isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {isPaid ? '🔒' : '🔓'}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">
                {isPaid ? 'Paid Mode Enabled' : 'Free Mode Active'}
              </div>
              <p className="text-gray-600 mt-1 max-w-md">
                {isPaid
                  ? 'Students must subscribe to access premium features and full platform content.'
                  : 'Everyone has full access. No subscription required.'}
              </p>
            </div>
          </div>

          <button
            onClick={togglePaidMode}
            disabled={toggling}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all ${
              isPaid 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {toggling ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isPaid ? (
              <ToggleRight className="w-6 h-6" />
            ) : (
              <ToggleLeft className="w-6 h-6" />
            )}
            {isPaid ? 'Disable Paid Mode' : 'Enable Paid Mode'}
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
          💰 Subscription Pricing
        </h2>
        <p className="text-gray-500 mb-8">Prices are shown to students in Sri Lankan Rupees (LKR).</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Monthly Subscription</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs.</span>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-2xl font-semibold border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                placeholder="2,500"
                min="0"
                step="100"
              />
            </div>
            <p className="text-xs text-gray-400">Billed every month</p>
          </div>

          {/* Yearly */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Yearly Subscription</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs.</span>
              <input
                type="number"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-2xl font-semibold border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C]"
                placeholder="24,000"
                min="0"
                step="100"
              />
            </div>
            <p className="text-xs text-emerald-600 font-medium">Recommended — often offered at a discount</p>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={savePricing}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0A2E1C] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#1A6B50] transition disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save New Pricing'}
          </button>

          <button
            onClick={load}
            className="px-6 py-4 text-gray-500 hover:text-gray-700 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-8 bg-gradient-to-r from-[#0A2E1C]/5 via-[#1A6B50]/5 to-transparent border border-[#0A2E1C]/10 rounded-3xl p-6 text-sm">
        <div className="flex items-center gap-2 text-[#0A2E1C] mb-3">
          <Eye className="w-5 h-5" />
          <strong>Student Preview</strong>
        </div>
        <p className="text-gray-600">
          When paid mode is enabled, students will see:
        </p>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-gray-600">
          <span>Monthly: <strong>Rs. {monthlyPrice || '—'}</strong></span>
          <span>Yearly: <strong>Rs. {yearlyPrice || '—'}</strong></span>
        </div>
      </div>
    </div>
  );
}