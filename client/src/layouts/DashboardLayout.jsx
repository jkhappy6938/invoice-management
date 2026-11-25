import { useState } from "react";

import {
  Menu,
  X,
} from "lucide-react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Desktop Sidebar */}

      <Sidebar />

      {/* Mobile Sidebar */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar />
          </div>

        </div>
      )}

      {/* Main Content */}

      <div className="flex flex-1 flex-col">

        {/* Mobile Top Navigation */}

        <div className="flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={24} />
          </button>

          <h2 className="font-bold text-emerald-600">
            InvoiceFlow
          </h2>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>

        {/* Topbar */}

        <Topbar />

        {/* Page Content */}

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;