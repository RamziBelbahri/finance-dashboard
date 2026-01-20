import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthState } from "../models/Auth";

interface AuthContextType extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };


    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const value: AuthContextType = {
        token,
        isAuthenticated: !!token,
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}