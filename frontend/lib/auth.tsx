"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchWithAuth, isDemoMode } from "./api";
import { DEMO_USER } from "./demo-data";

interface User {
    id: number;
    email: string;
    full_name: string;
    onboarding_complete: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Demo mode: auto-login with mock user
            if (isDemoMode()) {
                const hasDemoSession = localStorage.getItem("token");
                if (hasDemoSession) {
                    setUser(DEMO_USER as User);
                }
                setLoading(false);
                return;
            }

            // Real mode: check token with backend
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await fetchWithAuth("/users/me");
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem("token", token);

        if (isDemoMode()) {
            setUser(DEMO_USER as User);
            return;
        }

        const res = await fetchWithAuth("/users/me");
        if (res.ok) {
            const userData = await res.json();
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        if (isDemoMode()) {
            const basePath = "/Echelon";
            window.location.href = `${basePath}/login`;
        } else {
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
