import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
} from "lucide-react";

function InvoiceDetails() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [invoice, setInvoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice =
    async () => {
      try {
        const res =
          await api.get(
            `/api/invoices/${id}`
          );

        setInvoice(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const saveInvoice =
    async () => {
      try {
        await api.put(
          `/api/invoices/${id}`,
          invoice
        );

        alert(
          "Invoice updated successfully"
        );

        fetchInvoice();

      } catch (error) {
        console.error(error);

        alert(
          "Failed to update invoice"
        );
      }
    };

  const approveInvoice =
    async () => {
      try {

        await api.patch(
          `/api/invoices/${id}/approve`
        );

        fetchInvoice();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to approve invoice"
        );

      }
    };

  const rejectInvoice =
    async () => {
      try {

        await api.patch(
          `/api/invoices/${id}/reject`
        );

        fetchInvoice();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to reject invoice"
        );

      }
    };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>

          <p className="text-slate-600">
            Loading Invoice...
          </p>

        </div>

      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-96 items-center justify-center">

        <div className="rounded-3xl bg-white p-10 shadow">

          <h2 className="text-xl font-semibold">
            Invoice Not Found
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Invoice Details
          </h1>

          <p className="mt-2 text-slate-500">
            Review, verify and manage invoice information.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              navigate("/invoices")
            }
            className="rounded-xl bg-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Back
          </button>

          <button
            onClick={
              approveInvoice
            }
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
          >
            <CheckCircle size={18} />
            Approve
          </button>

          <button
            onClick={
              rejectInvoice
            }
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
          >
            <XCircle size={18} />
            Reject
          </button>

        </div>

      </div>

      {/* Main Grid */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Invoice Info */}

        <div className="rounded-3xl bg-white p-6 shadow">

          <h2 className="mb-6 text-lg font-semibold">
            Invoice Information
          </h2>

          <div className="space-y-4">

            <input
              value={
                invoice.invoiceNumber ||
                ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  invoiceNumber:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Invoice Number"
            />

            <input
              value={
                invoice.vendorName ||
                ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  vendorName:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Vendor Name"
            />

            <input
              value={
                invoice.gstNumber ||
                ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  gstNumber:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="GST Number"
            />

            <input
              value={
                invoice.subtotal || ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  subtotal:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Subtotal"
            />

            <input
              value={
                invoice.taxAmount || ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  taxAmount:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Tax Amount"
            />

            <input
              value={
                invoice.totalAmount ||
                ""
              }
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  totalAmount:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Total Amount"
            />

          </div>

          <button
            onClick={saveInvoice}
            className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
          >
            <Save size={18} />
            Save Changes
          </button>

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          <div className="rounded-3xl bg-white p-6 shadow">

            <h2 className="mb-6 text-lg font-semibold">
              Status
            </h2>

            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${invoice.status ===
                  "Approved"
                  ? "bg-green-100 text-green-700"
                  : invoice.status ===
                    "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
            >
              {invoice.status}
            </span>

            <div className="mt-8">

              <p className="mb-3 font-medium">
                Duplicate Detection
              </p>

              {invoice.isDuplicate ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle />
                  Possible Duplicate Invoice
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle />
                  Unique Invoice
                </div>
              )}

            </div>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow">

            <h2 className="mb-4 font-semibold">
              Invoice Category
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700">
              {invoice.category ||
                "General"}
            </span>

          </div>

          {invoice.warning && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

              <h3 className="font-semibold text-red-700">
                Warning Detected
              </h3>

              <p className="mt-2 text-red-600">
                {invoice.warning}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* AI Summary */}

      <div className="rounded-3xl bg-white p-6 shadow">

        <h2 className="mb-5 text-lg font-semibold">
          AI Generated Summary
        </h2>

        <pre className="whitespace-pre-wrap text-sm text-slate-700">
          {invoice.summary ||
            "No summary available"}
        </pre>

      </div>

      {/* OCR */}

      <div className="rounded-3xl bg-white p-6 shadow">

        <h2 className="mb-5 text-lg font-semibold">
          OCR Extracted Text
        </h2>

        <div className="rounded-2xl bg-slate-900 p-5">

          <pre className="whitespace-pre-wrap text-sm text-green-300">
            {invoice.extractedText ||
              "No OCR content available"}
          </pre>

        </div>

      </div>

      {/* History */}

      <div className="rounded-3xl bg-white p-6 shadow">

        <h2 className="mb-6 text-lg font-semibold">
          Processing History
        </h2>

        <div className="space-y-5">

          {invoice.history &&
            invoice.history.length > 0 ? (
            invoice.history.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                >
                  <div className="mt-1 h-4 w-4 rounded-full bg-emerald-500" />

                  <div>

                    <p className="font-medium">
                      {item.action}
                    </p>

                    <p className="text-sm text-slate-500">
                      {new Date(
                        item.timestamp
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>
              )
            )
          ) : (
            <p className="text-slate-500">
              No history available
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default InvoiceDetails;