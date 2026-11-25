import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            const data = await loginUser(formData);

            login(data.token);

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Left Side */}
                <div className="relative hidden overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-800 to-slate-900 lg:flex">
                    <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                    <span className="text-xl font-bold">₹</span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        InvoiceFlow
                                    </h2>

                                    <p className="text-sm text-emerald-100">
                                        Smart Invoice Management
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className="max-w-lg text-5xl font-bold leading-tight">
                                Manage invoices & payments effortlessly.
                            </h1>

                            <p className="mt-6 max-w-lg text-lg text-emerald-100">
                                Create invoices, track revenue, manage
                                customers and get paid faster with a
                                professional workflow.
                            </p>

                            <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-emerald-100">
                                            This Month Revenue
                                        </p>

                                        <h3 className="mt-2 text-3xl font-bold">
                                            ₹1,24,500
                                        </h3>
                                    </div>

                                    <span className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200">
                                        +18%
                                    </span>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Paid Invoices</span>
                                        <span>42</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span>Pending</span>
                                        <span>8</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span>Customers</span>
                                        <span>18</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-emerald-100/60">
                            © {new Date().getFullYear()} InvoiceFlow
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="mb-10 lg:hidden">
                            <h2 className="text-3xl font-bold text-slate-900">
                                InvoiceFlow
                            </h2>

                            <p className="mt-1 text-slate-500">
                                Smart Invoice Management
                            </p>
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">
                                Welcome Back
                            </h1>

                            <p className="mt-3 text-slate-500">
                                Sign in to access your dashboard and
                                manage invoices.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-10 space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-14 text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                        placeholder="Enter password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Signing In...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-400">
                            <span>Secure Login</span>
                            <span>•</span>
                            <span>Encrypted Data</span>
                            <span>•</span>
                            <span>JWT Protected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;