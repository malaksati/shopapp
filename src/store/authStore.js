import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user:  null,
            token: null,

            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null });
            },

            isAdmin: () => {
                // accessed as a getter
            },
        }),
        {
            name: 'auth-storage', // persists in localStorage
        }
    )
);

export default useAuthStore;