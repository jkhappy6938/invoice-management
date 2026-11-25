import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  LogOut,
  ShieldCheck,
  User,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
      isActive
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
      {/* Logo */}

      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              InvoiceFlow
            </h1>

            <p className="text-xs text-slate-400">
              Invoice Processing System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-4">
        <NavLink
          to="/dashboard"
          className={linkClasses}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/invoices"
          className={linkClasses}
        >
          <FileText size={20} />
          Invoices
        </NavLink>

        <NavLink
          to="/upload"
          className={linkClasses}
        >
          <Upload size={20} />
          Upload Invoice
        </NavLink>

        <NavLink
          to="/reports"
          className={linkClasses}
        >
          <BarChart3 size={20} />
          Reports
        </NavLink>

        <div className="my-4 border-t border-slate-800" />

        <NavLink
          to="/profile"
          className={linkClasses}
        >
          <User size={20} />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={linkClasses}
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      {/* User Card */}

      <div className="m-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 font-semibold text-white">
            H
          </div>

          <div>
            <p className="font-medium text-white">
              Happy Patra
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}

      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
