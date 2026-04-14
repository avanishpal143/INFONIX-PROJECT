import { create } from 'zustand'

interface ThemeStore {
    theme: 'dark' | 'light'
    toggleTheme: () => void
    setTheme: (theme: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    setTheme: (theme) => set({ theme }),
}))
