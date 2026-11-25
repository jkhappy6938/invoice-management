import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import UploadInvoice from "./pages/UploadInvoice";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InvoiceDetails from "./pages/InvoiceDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* Default */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Public */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected */}

      <Route
        element={<ProtectedRoute />}
      >
        <Route
          element={
            <DashboardLayout />
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/invoices"
            element={<Invoices />}
          />

          <Route
            path="/invoices/:id"
            element={
              <InvoiceDetails />
            }
          />

          <Route
            path="/upload"
            element={
              <UploadInvoice />
            }
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>
      </Route>

      {/* 404 */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-slate-50">

            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

              <h1 className="text-6xl font-bold text-emerald-600">
                404
              </h1>

              <p className="mt-4 text-slate-600">
                Page not found
              </p>

            </div>

          </div>
        }
      />

    </Routes>
  );
}

export default App;