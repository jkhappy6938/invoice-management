import API from "./api";

export const exportExcel =
  async () => {
    const response =
      await API.get(
        "/api/export/excel",
        {
          responseType:
            "blob",
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "invoices.xlsx"
    );

    document.body.appendChild(
      link
    );

    link.click();
  };

export const exportPDF =
  async () => {
    const response =
      await API.get(
        "/api/export/pdf",
        {
          responseType:
            "blob",
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "invoices.pdf"
    );

    document.body.appendChild(
      link
    );

    link.click();
  };