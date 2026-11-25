import API from "./api";

// Register user
export const registerUser = async (userData) => {
    const response = await API.post(
        "/api/auth/register",
        userData
    );

    return response.data;
};

// Login user
export const loginUser = async (userData) => {
    const response = await API.post(
        "/api/auth/login",
        userData
    );

    // Store JWT token after successful login
    localStorage.setItem("token", response.data.token);

    return response.data;
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem("token");
};