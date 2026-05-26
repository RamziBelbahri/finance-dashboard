import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState } from "../types/Auth";
import { getTokenExpiration, isTokenExpired } from "../utils/jwt";
import { clearAuth } from "./auth";
import { AUTH_LOGOUT_EVENT } from "./authEvents";

interface AuthContextType extends AuthState {
    login: (token: string) => void;
    logout: () => void;
    initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [initialized, setInitialized] = useState(false);
    const storedToken = localStorage.getItem("token");
    const validToken = storedToken && !isTokenExpired(storedToken);
    const [token, setToken] = useState<string | null>( validToken ? storedToken : null);

    useEffect(() => {
        setInitialized(true);
        const handleLogout = () => logout();
        window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
        return () => {
            window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
        };
    }, [])

    useEffect(() => {
        if(!token) return;
        const expiration = getTokenExpiration(token);
        if(!expiration) return;
        const timeout = expiration - Date.now();
        if(timeout <= 0) {
            logout();
            return;
        }
        const expirationTimer = setTimeout(()=> {
            logout();
        }, timeout);

        return () => clearTimeout(expirationTimer);
                
    }, [token]);

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
        logout,
        initialized
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}