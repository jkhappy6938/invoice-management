import React, { useState } from "react";
import api from "../services/api";

function TokenTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testToken = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/auth/profile");

      setResult(
        JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      setResult(
        JSON.stringify(
          {
            error:
              error.response?.data?.message ||
              "Request failed",
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Developer Tools
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            JWT Authentication Tester
          </h1>

          <p className="mt-3 text-slate-500">
            Verify interceptor behavior, JWT
            token injection and protected route
            access.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Protected Endpoint Test
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                GET /api/auth/profile
              </p>
            </div>

            <button
              onClick={testToken}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Testing...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Test Protected API
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                API Response
              </h3>

              {result && (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  JSON Output
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />

                <span className="ml-3 text-sm text-slate-400">
                  response.json
                </span>
              </div>

              <pre className="min-h-87.5 overflow-auto p-6 text-sm leading-7 text-emerald-300">
                {result ||
                  `{
  "message": "Click 'Test Protected API' to begin"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-semibold text-slate-900">
              JWT Token
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Automatically retrieved from
              localStorage and attached through
              Axios interceptors.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-semibold text-slate-900">
              Protected Route
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Tests authentication middleware and
              backend JWT verification flow.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-semibold text-slate-900">
              API Status
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Confirms successful communication
              between frontend and Express backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenTest;