import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
    Bell,
    Search,
    ChevronDown,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
    const [open, setOpen] = useState(false);

    const { logout } = useAuth();

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-6 lg:px-8">

                {/* Left */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome back 👋
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage invoices and monitor
                        business performance.
                    </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">

                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-72 rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Notification */}
                    <button className="relative rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
                        <Bell size={20} />

                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                    </button>

                    {/* Profile */}
                    <div
                        className="relative"
                        ref={dropdownRef}
                    >
                        <button
                            onClick={() =>
                                setOpen(!open)
                            }
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 font-semibold text-white">
                                H
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    Happy Patra
                                </p>

                                <p className="text-xs text-slate-500">
                                    Administrator
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`transition-transform ${open
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown */}
                        {open && (
                            <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-100 px-4 py-4">
                                    <p className="font-semibold text-slate-900">
                                        Happy Patra
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Administrator
                                    </p>
                                </div>

                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                                >
                                    <User size={18} />
                                    My Profile
                                </Link>

                                <Link
                                    to="/settings"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                                >
                                    <Settings size={18} />
                                    Settings
                                </Link>
                                <hr />

                                <button
                                    onClick={
                                        handleLogout
                                    }
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Topbar;