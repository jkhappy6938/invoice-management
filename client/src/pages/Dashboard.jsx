import { useEffect, useState } from "react";

import {
  FileText,
  CircleCheck,
  CircleX,
  Clock3,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { getDashboardStats } from "../services/dashboardService";

const recentInvoices = [
  {
    invoiceNumber: "INV-1001",
    vendor: "Infosys Ltd",
    amount: "₹45,000",
    status: "Approved",
  },
  {
    invoiceNumber: "INV-1002",
    vendor: "Wipro Ltd",
    amount: "₹28,500",
    status: "Pending",
  },
  {
    invoiceNumber: "INV-1003",
    vendor: "TCS",
    amount: "₹92,000",
    status: "Rejected",
  },
];

const Dashboard = () => {
  const [stats, setStats] =
    useState({
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      duplicates: 0,
      revenue: 0,
      recentInvoices: [],
    });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data =
          await getDashboardStats();

        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: "Total Invoices",
      value: stats.total,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CircleCheck,
      color:
        "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock3,
      color:
        "bg-amber-100 text-amber-600",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: CircleX,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Duplicates",
      value: stats.duplicates,
      icon: FileText,
      color:
        "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}

      <div className="overflow-hidden rounded-3xl bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Invoice Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-emerald-50">
              Monitor invoice processing,
              approvals, rejections and
              business performance in
              real time.
            </p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
            <TrendingUp size={42} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-4xl font-bold text-slate-900">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`rounded-2xl p-4 ${item.color}`}
                  >
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Revenue & Summary */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Total Revenue
              </h2>

              <p className="text-sm text-slate-500">
                Revenue generated from approved invoices
              </p>

              <h3 className="mt-4 text-4xl font-bold text-emerald-600">
                ₹
                {stats.revenue?.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <IndianRupee size={24} />
            </div>
          </div>

          <div className="mt-8 flex items-end gap-4">
            {[50, 70, 40, 90, 110, 95, 140].map(
              (
                height,
                index
              ) => (
                <div
                  key={index}
                  className="flex-1"
                >
                  <div
                    style={{
                      height: `${height * 2}px`,
                    }}
                    className="rounded-t-xl bg-emerald-500"
                  />

                  <p className="mt-2 text-center text-xs text-slate-500">
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                      ][index]
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Processing Summary
          </h2>

          <div className="mt-6 space-y-5">
            <ProgressRow
              title="Approved"
              percentage="70%"
              width="70%"
              color="bg-emerald-500"
            />

            <ProgressRow
              title="Pending"
              percentage="20%"
              width="20%"
              color="bg-amber-500"
            />

            <ProgressRow
              title="Rejected"
              percentage="10%"
              width="10%"
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Recent Invoices */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h2>

          <p className="text-sm text-slate-500">
            Latest uploaded invoices
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Invoice Number
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Vendor
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {stats.recentInvoices?.map(
                (
                  invoice
                ) => (
                  <tr
                    key={
                      invoice.invoiceNumber
                    }
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {
                        invoice.invoiceNumber
                      }
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {
                        invoice.vendorName
                      }
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {
                        `₹${invoice.totalAmount || 0}`
                      }
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.status ===
                          "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : invoice.status ===
                            "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {
                          invoice.status
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProgressRow = ({
  title,
  percentage,
  width,
  color,
}) => (
  <div>
    <div className="mb-2 flex justify-between">
      <span>{title}</span>
      <span>{percentage}</span>
    </div>

    <div className="h-3 rounded-full bg-slate-100">
      <div
        style={{ width }}
        className={`h-3 rounded-full ${color}`}
      />
    </div>
  </div>
);

export default Dashboard;