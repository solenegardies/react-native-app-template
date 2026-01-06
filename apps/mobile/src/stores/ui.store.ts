import { create } from 'zustand';

interface UiState {
  isGlobalLoading: boolean;
  toastMessage: string | null;
  setGlobalLoading: (loading: boolean) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  toastMessage: null,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
}));
