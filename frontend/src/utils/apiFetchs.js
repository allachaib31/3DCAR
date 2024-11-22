import axios from "axios";
import { authAdminRoute, authClientRoute } from "./apiRoutes";

// Enable credentials for cross-origin requests
axios.defaults.withCredentials = true;

// Get tokens from local storage
const getToken = () => localStorage.getItem("token");
const getTokenClient = () => localStorage.getItem("tokenClient");

// Set headers dynamically based on the role (client or admin)
const setAuthorizationHeader = (isClient = false) => {
    const token = isClient ? getTokenClient() : getToken();
    const headerKey = isClient ? "AuthorizationClient" : "Authorization";

    if (token) {
        axios.defaults.headers.common[headerKey] = `${token}`;
    } else {
        delete axios.defaults.headers.common[headerKey]; // Remove header if no token
    }
};

// Save token in local storage and set the appropriate header
export const saveToken = (token, name, isClient = false) => {
    localStorage.setItem(name, token);
    setAuthorizationHeader(isClient);
};

// POST method with dynamic token handling
export const postMethode = async (url, data) => {
    const isClient = url === authClientRoute; // Determine if it's a client login
    setAuthorizationHeader(isClient);

    const response = await axios.post(url, data);

    // Save token based on the route
    if (isClient) {
        saveToken(response.data.tokenClient, "tokenClient", true);
    } else if (url === authAdminRoute) {
        saveToken(response.data.token, "token", false);
    }

    return response;
};

// GET method
export const getMethode = async (url, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.get(url);
};

// PUT method
export const putMethode = async (url, data, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.put(url, data);
};

// PATCH method
export const patchMethode = async (url, data, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.patch(url, data);
};

// DELETE method
export const deleteMethode = async (url, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.delete(url);
};
