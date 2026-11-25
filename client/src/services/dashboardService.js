import API from "./api";

export const getDashboardStats =
  async () => {
    const response =
      await API.get(
        "/api/dashboard/stats"
      );

    return response.data;
  };