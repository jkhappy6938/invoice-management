
import API from "./api";

// Get reports from backend
export const getReports = async (
  startDate = "",
  endDate = ""
) => {
  try {
    const params = {};

    // Send dates only when both are selected
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await API.get("/api/reports", {
      params,
    });

    return response.data;

  } catch (error) {
    console.error(
      "Report API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
