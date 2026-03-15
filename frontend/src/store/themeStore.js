import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,

      toggleTheme: () => {
        const newTheme = !get().isDark;
        set({ isDark: newTheme });
        if (newTheme) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      },

      initTheme: () => {
        if (get().isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    { name: 'theme-storage' }
  )
);

export default useThemeStore;