import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { clearAuth } from "../auth/auth";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface IFormInputs {
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm<IFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  });
  const password = watch("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    trigger('confirmPassword');
  }, [password]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data: FieldValues) => {
    setLoading(true);
    setError(null);
    clearAuth();
    try {
      const response = await api.post("/auth/register", { email: data.email, password: data.password });
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
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create a new account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email", { required: true, pattern: EMAIL_REGEX })}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                {errors.email?.type === "required" && <span className="text-red-500"> Email is required</span>}
                {errors.email?.type === "pattern" && <span className="text-red-500"> Email should match pattern : address@domain.topdomain </span>}
              </div>
            </div>

            <div >
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("password", { required: true, pattern: PASSWORD_REGEX })}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                {errors.password?.type === "required" && <span className="text-red-500">Password is required</span>}
                {errors.password?.type === "pattern" && <span className="text-red-500">Password should be between 8 and 16 characters long and contain atleast a lower-case letter, upper-case letter, digit, and a special character (@, $, !, %, *, ?, or &).</span>}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Confirm password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("password") || "Both passwords must match"
                  })}
                  id="confirmPassword"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white
    ${loading ? "bg-gray-600" : "bg-blue-800 hover:bg-blue-900"}`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-blue-400 hover:text-blue-900">
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}