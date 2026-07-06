import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  theme: "light" | "dark";
  density: "compact" | "comfortable";
  toggleTheme: () => void;
  setDensity: (density: "compact" | "comfortable") => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      density: "comfortable",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setDensity: (density) => set({ density }),
    }),
    { name: "myshelf.ui" },
  ),
);
