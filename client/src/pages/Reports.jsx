
import { useCallback, useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getReports } from "../services/reportService";

import {
  exportExcel,
  exportPDF,
} from "../services/exportService";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const [retryCount, setRetryCount] = useState(0);

  // Fetch reports
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReports(
        appliedStartDate,
        appliedEndDate
      );

      setReportData(data);

    } catch (err) {
      console.error("Reports API Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load reports."
      );

    } finally {
      setLoading(false);
    }
  }, [appliedStartDate, appliedEndDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports, retryCount]);

  // Apply filters
  const handleApplyFilters = () => {
    if (!startDate || !endDate) {
      setError("Please select both start date and end date.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  // Clear filters
  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
  };

  // Retry failed request
  const handleRetry = () => {
    setRetryCount((previous) => previous + 1);
  };

  // Chart data
  const invoiceStatusData = [
    { name: "Approved", value: reportData?.approved || 0 },
    { name: "Pending", value: reportData?.pending || 0 },
    { name: "Rejected", value: reportData?.rejected || 0 },
  ];

  const revenueData = reportData?.monthlyReports?.length
    ? reportData.monthlyReports.map((item) => ({
        month: item.month,
        revenue: Number(item.revenue || 0),
      }))
    : [
        {
          month: "Revenue",
          revenue: Number(reportData?.totalRevenue || 0),
        },
      ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports & Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            Revenue insights, invoice trends and vendor-wise reports.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Export Excel
          </button>

          <button
            onClick={exportPDF}
            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Filter Reports
        </h2>

        <div className="flex flex-wrap items-end gap-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 p-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 p-2"
            />
          </div>

          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Apply Filters
          </button>

          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="rounded-lg bg-slate-100 px-5 py-2 font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>

        {appliedStartDate && appliedEndDate && (
          <p className="mt-3 text-sm text-emerald-700">
            Showing reports from {appliedStartDate} to {appliedEndDate}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={handleRetry}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          Loading reports...
        </div>
      )}

      {/* Dashboard */}
      {reportData && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3">

            <Card
              title="Total Revenue"
              value={`₹${Number(reportData.totalRevenue || 0).toLocaleString("en-IN")}`}
              color="emerald"
            />

            <Card
              title="Invoices Processed"
              value={reportData.totalInvoices || 0}
              color="blue"
            />

            <Card
              title="Vendors"
              value={reportData.totalVendors || 0}
              color="amber"
            />
          </div>

          {/* Revenue Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Monthly Revenue Overview
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status and Vendors */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Invoice Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-semibold text-slate-900">
                Invoice Status
              </h2>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Vendors */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-semibold text-slate-900">
                Top Vendors
              </h2>

              <div className="space-y-4">
                {reportData.topVendors?.length > 0 ? (
                  reportData.topVendors.map((vendor, index) => (
                    <div
                      key={vendor.vendor || index}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {vendor.vendor}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {vendor.invoices} invoices
                        </p>
                      </div>

                      <div className="font-semibold text-emerald-600">
                        ₹{Number(vendor.amount || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                    No vendor data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// KPI Card
const Card = ({ title, value, color }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-3xl p-6 shadow-sm ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h2 className="mt-3 text-4xl font-bold">{value}</h2>
    </div>
  );
};

export default Reports;
