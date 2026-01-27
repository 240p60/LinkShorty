/**
 * Store configuration
 * This is a simple store setup. Replace with Redux/Zustand as needed.
 */

// Example store state type
export interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
}

// Initial state
export const initialState: AppState = {
  theme: "light",
  sidebarOpen: true,
};

// Simple store (can be replaced with Zustand/Redux)
let state = { ...initialState };
const listeners = new Set<() => void>();

export const store = {
  getState: () => state,

  setState: (partial: Partial<AppState>) => {
    state = { ...state, ...partial };
    for (const listener of listeners) {
      listener();
    }
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export default store;
