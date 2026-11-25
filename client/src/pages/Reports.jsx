import { useEffect, useState } from "react";

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

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const Reports = () => {
  const [reportData, setReportData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadReports =
      async () => {
        try {
          const data =
            await getReports();

          setReportData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-500">
          Loading Reports...
        </p>
      </div>
    );
  }

  const invoiceStatusData = [
    {
      name: "Approved",
      value:
        reportData?.approved || 0,
    },
    {
      name: "Pending",
      value:
        reportData?.pending || 0,
    },
    {
      name: "Rejected",
      value:
        reportData?.rejected || 0,
    },
  ];

  const revenueData = [
    {
      month: "Revenue",
      revenue:
        reportData?.totalRevenue ||
        0,
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
            Revenue insights, invoice
            trends and vendor-wise
            reports.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={exportExcel}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
          >
            Export Excel
          </button>

          <button
            onClick={exportPDF}
            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Export PDF
          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-3">

        <Card
          title="Total Revenue"
          value={`₹${(
            reportData?.totalRevenue ||
            0
          ).toLocaleString()}`}
          color="emerald"
        />

        <Card
          title="Invoices Processed"
          value={
            reportData?.totalInvoices ||
            0
          }
          color="blue"
        />

        <Card
          title="Vendors"
          value={
            reportData?.totalVendors ||
            0
          }
          color="amber"
        />

      </div>

      {/* Revenue Chart */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Revenue Overview
        </h2>

        <div className="h-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={revenueData}
            >
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

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Status Distribution */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Invoice Status
          </h2>

          <div className="h-80">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={
                    invoiceStatusData
                  }
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >

                  {invoiceStatusData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}

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

            {reportData?.topVendors
              ?.length > 0 ? (

              reportData.topVendors.map(
                (vendor) => (
                  <div
                    key={
                      vendor.vendor
                    }
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div>

                      <h3 className="font-medium text-slate-900">
                        {
                          vendor.vendor
                        }
                      </h3>

                      <p className="text-sm text-slate-500">
                        {
                          vendor.invoices
                        }{" "}
                        invoices
                      </p>

                    </div>

                    <div className="font-semibold text-emerald-600">
                      ₹
                      {Number(
                        vendor.amount || 0
                      ).toLocaleString()}
                    </div>

                  </div>
                )
              )

            ) : (

              <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                No vendor data available
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

const Card = ({
  title,
  value,
  color,
}) => {
  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-700",

    blue:
      "bg-blue-50 text-blue-700",

    amber:
      "bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`rounded-3xl p-6 shadow-sm ${colors[color]}`}
    >
      <p className="text-sm">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {value}
      </h2>
    </div>
  );
};

export default Reports;