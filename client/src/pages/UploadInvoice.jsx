import { useState } from "react";
import API from "../services/api";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const UploadInvoice = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an invoice file.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("invoice", file);

      const res = await API.post(
        "/api/invoices/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(res.data);

      console.log("✅ SUCCESS:", res.data);
    } catch (err) {
      console.error("FULL ERROR:", err);

      console.log(
        "RAW RESPONSE:",
        err.response?.data
      );

      alert(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      setError(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Upload Invoice
        </h1>

        <p className="mt-2 text-slate-500">
          Upload PDF, PNG, JPG or JPEG invoice files.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-3xl bg-emerald-100 p-6">
            <UploadCloud
              size={42}
              className="text-emerald-600"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            Upload Invoice
          </h2>

          <p className="mt-2 text-slate-500">
            PDF • PNG • JPG • JPEG
          </p>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="mt-8 block w-full max-w-md rounded-2xl border border-slate-300 px-4 py-3"
          />

          {file && (
            <div className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {file.name}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 rounded-2xl bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Processing...
              </span>
            ) : (
              "Upload & Extract"
            )}
          </button>

          {error && (
            <div className="mt-6 w-full rounded-xl bg-red-50 p-4 text-left">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
                <span className="font-medium">
                  Upload Error
                </span>
              </div>

              <pre className="mt-2 whitespace-pre-wrap text-sm text-red-700">
                {error}
              </pre>
            </div>
          )}
        </div>
      </div>

      {response?.duplicate && (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6">
          <div className="flex gap-4">
            <AlertTriangle className="text-amber-600" />

            <div>
              <h3 className="font-semibold text-amber-800">
                Potential Duplicate Invoice Detected
              </h3>

              <p className="mt-2 text-sm text-amber-700">
                This invoice already exists in
                the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {response?.extractedData && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" />

            <h2 className="text-xl font-bold text-slate-900">
              Extracted Invoice Details
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard
              title="Invoice Number"
              value={
                response.extractedData
                  ?.invoiceNumber
              }
            />

            <InfoCard
              title="Invoice Date"
              value={
                response.extractedData
                  ?.invoiceDate
              }
            />

            <InfoCard
              title="Due Date"
              value={
                response.extractedData
                  ?.dueDate
              }
            />

            <InfoCard
              title="Tax Amount"
              value={
                response.extractedData?.tax
              }
            />

            <InfoCard
              title="Total Amount"
              value={
                response.extractedData?.total
              }
            />
          </div>
        </div>
      )}

      {response && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="text-emerald-600" />

            <h2 className="text-xl font-bold text-slate-900">
              OCR Extracted Content
            </h2>
          </div>

          <div className="overflow-auto rounded-2xl bg-slate-950 p-6">
            <pre className="whitespace-pre-wrap text-sm text-emerald-300">
              {response.extractedText ||
                JSON.stringify(
                  response,
                  null,
                  2
                )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-sm text-slate-500">
      {title}
    </p>

    <h3 className="mt-1 font-semibold text-slate-900">
      {value || "-"}
    </h3>
  </div>
);

export default UploadInvoice;