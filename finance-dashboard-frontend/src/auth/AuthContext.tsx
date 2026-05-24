import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthState } from "../types/Auth";
import { isTokenExpired } from "../utils/jwt";
import { clearAuth } from "./auth";

interface AuthContextType extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const storedToken = localStorage.getItem("token");
    const validToken = storedToken && !isTokenExpired(storedToken);
    const [token, setToken] = useState<string | null>( validToken ? storedToken : null);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        clearAuth();
        setToken(null);
    };

    const value: AuthContextType = {
        token,
        isAuthenticated: !!token && !isTokenExpired(token),
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