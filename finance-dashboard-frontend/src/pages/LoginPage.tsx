import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { useState } from "react";
import { clearAuth } from "../auth/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    clearAuth();
    try {
      const response = await api.post("/auth/login", { email: email, password: password });
      const jwt = response.data.token;
      login(jwt);
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full bg-gray-800 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mb-10 text-center text-2xl/9 font-bold tracking-tight text-white">Finance dashboard</h1>
          <img
            alt="Your Company"
            src="./assets/icons/dashboard.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-400 hover:text-blue-900">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white
    ${loading ? "bg-gray-600" : "bg-blue-800 hover:bg-blue-900"}`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a href="#" className="font-semibold text-blue-400 hover:text-blue-900">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  )
}