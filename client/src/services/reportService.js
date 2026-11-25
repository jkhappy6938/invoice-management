import API from "./api";

export const getReports =
  async () => {
    const response =
      await API.get(
        "/api/reports"
      );

    return response.data;
  };
