import { create } from 'zustand'

export const useSettingsStore = create((set) => ({
  paidModeEnabled: false,
  monthlyPrice: 990,
  yearlyPrice: 8900,
  bankName: 'Bank of Ceylon',
  accountNumber: '7890-1234-5678',
  accountHolder: 'SL Job Bank (Pvt) Ltd',

  setSettings: (settings) => set(settings),
}))


