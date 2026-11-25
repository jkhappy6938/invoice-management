import { useState } from "react";
import { registerUser } from "../services/authService";

const inputClasses =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 " +
    "placeholder:text-slate-400 transition " +
    "hover:border-slate-400 " +
    "focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15 " +
    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

// Password strength: 0 (empty) to 4
const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
    return Math.max(score, 1);
};

const strengthMeta = [
    null,
    { label: "Weak", bar: "bg-red-500", text: "text-red-600" },
    { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
    { label: "Good", bar: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Strong", bar: "bg-emerald-600", text: "text-emerald-700" }
];

function LogoMark({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 2h9l5 5v15H6z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h8M9 17h5" />
        </svg>
    );
}

function Register() {
    // Store form input values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    // Store success and error messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Track whether registration is in progress
    const [loading, setLoading] = useState(false);

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const strength = getStrength(formData.password);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Basic frontend validation
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please fill in all fields");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const result = await registerUser(formData);

            setMessage(result.message);

            // Clear form after successful registration
            setFormData({
                name: "",
                email: "",
                password: ""
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-2">
            {/* Left: brand panel with invoice preview (desktop only) */}
            <aside className="relative hidden overflow-hidden bg-emerald-950 lg:flex lg:flex-col lg:justify-between lg:p-14">
                {/* Soft background glow */}
                <div
                    className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
                    aria-hidden="true"
                />

                {/* Logo */}
                <div className="relative flex items-center gap-2.5 text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400 text-emerald-950">
                        <LogoMark className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        InvoiceFlow
                    </span>
                </div>

                {/* Headline + invoice mock */}
                <div className="relative">
                    <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
                        Send invoices in minutes. Get paid without the chasing.
                    </h1>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-100/70">
                        Create invoices, track payments and keep every client
                        record in one place.
                    </p>

                    {/* Invoice preview card */}
                    <div className="relative mt-12 max-w-sm -rotate-2 rounded-xl bg-white p-6 shadow-2xl shadow-black/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Invoice #2048
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Due 30 Nov 2026
                                </p>
                            </div>
                            <span className="rotate-6 rounded-md border-2 border-emerald-600 px-2.5 py-0.5 text-sm font-bold text-emerald-600">
                                PAID
                            </span>
                        </div>

                        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm tabular-nums">
                            <div className="flex justify-between text-slate-600">
                                <span>Website redesign</span>
                                <span>₹48,000</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Hosting (12 months)</span>
                                <span>₹9,600</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>GST (18%)</span>
                                <span>₹10,368</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 tabular-nums">
                            <span className="text-sm font-medium text-slate-900">
                                Total
                            </span>
                            <span className="text-xl font-semibold text-slate-900">
                                ₹67,968
                            </span>
                        </div>
                    </div>
                </div>

                <p className="relative text-sm text-emerald-100/50">
                    © {new Date().getFullYear()} InvoiceFlow
                </p>
            </aside>

            {/* Right: form */}
            <main className="flex items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-10 flex items-center gap-2.5 lg:hidden">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 text-emerald-300">
                            <LogoMark className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900">
                            InvoiceFlow
                        </span>
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-[15px] text-slate-500">
                        Start sending professional invoices today.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                        noValidate
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                className={inputClasses}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Work email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className={inputClasses}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`${inputClasses} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition hover:text-slate-700 focus:outline-none focus-visible:text-emerald-700"
                                >
                                    {showPassword ? (
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 6.1A10.9 10.9 0 0112 6c5 0 9 6 9 6a17 17 0 01-3.2 3.7M6.6 6.6A17 17 0 003 12s4 6 9 6a9.7 9.7 0 004.1-.9" />
                                            <path d="M9.9 9.9a3 3 0 004.2 4.2" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Strength meter */}
                            {formData.password && (
                                <div className="mt-3" aria-live="polite">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <span
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength
                                                    ? strengthMeta[strength]
                                                        .bar
                                                    : "bg-slate-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p
                                        className={`mt-1.5 text-xs font-medium ${strengthMeta[strength].text}`}
                                    >
                                        {strengthMeta[strength].label} password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Feedback messages */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div
                                role="status"
                                className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                            >
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.58 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-[15px] font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/30 active:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-500"
                        >
                            {loading && (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                            )}
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-emerald-700 hover:text-emerald-600 hover:underline"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Register;