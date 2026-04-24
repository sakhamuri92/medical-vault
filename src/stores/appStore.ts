import { create } from 'zustand';

interface AppState {
  defaultCountryCode: string;
  hasCompletedOnboarding: boolean;
  setDefaultCountryCode: (code: string) => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  defaultCountryCode: 'IN',
  hasCompletedOnboarding: false,
  setDefaultCountryCode: (code) => set({ defaultCountryCode: code }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
