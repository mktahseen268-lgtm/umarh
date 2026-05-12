import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id:         string;
  email:      string;
  first_name: string;
  last_name:  string;
  status:     string;
  preferred_language: string;
  roles:      string[];
}

interface AuthStore {
  user:   AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout:  () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout:  () => set({ user: null }),
      isLoggedIn: () => get().user !== null,
    }),
    { name: "umrah-auth" }
  )
);
