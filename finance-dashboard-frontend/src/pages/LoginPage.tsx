import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

export default function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const email = "test@test.com";
      const password = "secret123";
      const response = await api.post("/auth/login", { email : email, password: password });
      const jwt = response.data.token;
      login(jwt);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    logout();
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}