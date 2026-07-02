import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  isUploading: boolean;
  setUploading: (status: boolean) => void;
  theme: 'Dark' | 'Light' | 'System';
  setTheme: (theme: 'Dark' | 'Light' | 'System') => void;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string | null) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      isUploading: false,
      setUploading: (status) => set({ isUploading: status }),
      theme: 'System',
      setTheme: (theme) => set({ theme }),
      currentWorkspaceId: null,
      setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
    }),
    {
      name: 'cryptonest-storage',
    }
  )
);
