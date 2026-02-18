"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Employee } from "@/lib/types";
import { loginAsManager, loginAsEmployee } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: Employee | null;
    loading: boolean;
    loginManager: (email: string) => Promise<boolean>;
    loginKiosk: (pin: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    loginManager: async () => false,
    loginKiosk: async () => false,
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginManager = async (email: string) => {
        setLoading(true);
        const u = await loginAsManager(email);
        setLoading(false);
        if (u) {
            setUser(u);
            return true;
        }
        return false;
    };

    const loginKiosk = async (pin: string) => {
        setLoading(true);
        const u = await loginAsEmployee(pin);
        setLoading(false);
        if (u) {
            setUser(u);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginManager, loginKiosk, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
