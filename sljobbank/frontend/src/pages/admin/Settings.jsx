import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '@/api';
import { Save, Building2, CreditCard, User, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then(res => setForm(res.data.data));
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      await settingsApi.update(form);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0A2E1C] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0A2E1C] rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure platform payment and banking information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-gray-600">
            These bank details will be shown to students who choose manual bank transfer payments.
          </p>
        </div>

        <form onSubmit={save} className="space-y-8">
          <div className="space-y-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Bank Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C] focus:border-transparent transition"
                value={form.bankName || ''}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="e.g. Commercial Bank of Ceylon"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Account Number
              </label>
              <input
                type="text"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C] focus:border-transparent font-mono tracking-wider transition"
                value={form.accountNumber || ''}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="1234567890"
              />
            </div>

            {/* Account Holder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Account Holder Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A2E1C] focus:border-transparent transition"
                value={form.accountHolder || ''}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                placeholder="e.g. Career Guidance Platform (Pvt) Ltd"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-3 bg-[#0A2E1C] hover:bg-[#1A6B50] text-white font-semibold py-4 rounded-2xl transition disabled:opacity-70"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Changes will be reflected immediately for new payment instructions.
      </p>
    </div>
  );
}