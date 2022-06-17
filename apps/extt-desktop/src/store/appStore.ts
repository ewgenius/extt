import create from "zustand";

export interface AppStoreState {
  sidebarOpen: boolean;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  sidebarOpen: false,

  openSidebar: () =>
    set((state) => ({
      ...state,
      sidebarOpen: true,
    })),

  closeSidebar: () =>
    set((state) => ({
      ...state,
      sidebarOpen: false,
    })),

  toggleSidebar: () =>
    set((state) => ({
      ...state,
      sidebarOpen: !state.sidebarOpen,
    })),
}));
