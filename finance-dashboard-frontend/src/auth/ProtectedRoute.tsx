import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, initialized } = useAuth();
    if (!initialized) {
        return <div className="text-white">Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    return children;
}