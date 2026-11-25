import API from "./api";

export const getInvoices =
  async () => {
    const response =
      await API.get(
        "/api/invoices"
      );

    return response.data;
  };