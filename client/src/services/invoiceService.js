import API from "./api";

export const uploadInvoice = async (
  formData
) => {
  const response = await API.post(
    "/api/invoices/upload",
    formData
  );

  return response.data;
};

export const getInvoices =
  async () => {
    const response =
      await API.get(
        "/api/invoices"
      );

    return response.data;
  };

export const approveInvoice =
  async (id) => {
    const response =
      await API.patch(
        `/api/invoices/${id}/approve`
      );

    return response.data;
  };

export const rejectInvoice =
  async (id) => {
    const response =
      await API.patch(
        `/api/invoices/${id}/reject`
      );

    return response.data;
  };