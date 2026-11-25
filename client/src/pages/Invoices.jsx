import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  getInvoices,
  approveInvoice,
  rejectInvoice,
} from "../services/invoiceService";

const Invoices = () => {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [invoices, setInvoices] =
    useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices =
    async () => {
      try {
        const data =
          await getInvoices();

        setInvoices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const updateStatus =
    async (id, status) => {
      try {
        if (
          status === "Approved"
        ) {
          await approveInvoice(id);
        } else {
          await rejectInvoice(id);
        }

        await fetchInvoices();

      } catch (error) {
        console.error(error);
      }
    };

  const filteredInvoices =
    invoices.filter(
      (invoice) =>
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        (
          invoice.vendorName ||
          ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Invoice Management
        </h1>

        <p className="mt-2 text-slate-500">
          Review, manage and track
          invoice processing.
        </p>
      </div>

      {/* Search */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Uploaded Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            OCR processed invoices
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-slate-50">

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Invoice Number
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Vendor
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>

                  <td
                    colSpan="5"
                    className="py-16 text-center"
                  >

                    <div className="flex items-center justify-center gap-3 text-slate-500">
                      <Loader2 className="animate-spin" />
                      Loading invoices...
                    </div>

                  </td>

                </tr>
              ) : filteredInvoices.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="5"
                    className="py-16 text-center text-slate-500"
                  >
                    No invoices found.
                  </td>

                </tr>
              ) : (
                filteredInvoices.map(
                  (invoice) => (
                    <tr
                      key={
                        invoice._id
                      }
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">

                        {
                          invoice.invoiceNumber
                        }

                        {invoice.isDuplicate && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                            <AlertTriangle
                              size={12}
                            />
                            Duplicate
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {
                          invoice.vendorName ||
                          "Unknown Vendor"
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        ₹
                        {invoice.totalAmount ||
                          0}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            invoice.status ===
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

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          {/* View */}

                          <button
                            onClick={() =>
                              navigate(
                                `/invoices/${invoice._id}`
                              )
                            }
                            className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
                          >
                            <Eye
                              size={18}
                            />
                          </button>

                          {/* Approve */}

                          <button
                            onClick={() =>
                              updateStatus(
                                invoice._id,
                                "Approved"
                              )
                            }
                            className="rounded-xl bg-emerald-100 p-2 text-emerald-600 transition hover:bg-emerald-200"
                          >
                            <CheckCircle
                              size={18}
                            />
                          </button>

                          {/* Reject */}

                          <button
                            onClick={() =>
                              updateStatus(
                                invoice._id,
                                "Rejected"
                              )
                            }
                            className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                          >
                            <XCircle
                              size={18}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Invoices;