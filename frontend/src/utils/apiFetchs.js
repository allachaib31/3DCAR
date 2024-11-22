import axios from "axios";
import { authAdminRoute, authClientRoute } from "./apiRoutes";

axios.defaults.withCredentials = true;

// Function to get the token from local storage
const getToken = () => localStorage.getItem("token");
const getTokenClient = () => localStorage.getItem("tokenClient");

// Function to set the token in Axios headers
const setAuthorizationHeader = (isClient = false) => {
    if (isClient) {
        const tokenClient = getTokenClient();
        if (tokenClient) {
            axios.defaults.headers.common["AuthorizationClient"] = `${tokenClient}`;
        } else {
            delete axios.defaults.headers.common["AuthorizationClient"];
        }
    } else {
        const token = getToken();
        if (token) {
            axios.defaults.headers.common["Authorization"] = `${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }
};

// Save tokens with dynamic key and update headers
export const saveToken = (token, name, isClient = false) => {
    localStorage.setItem(name, token);
    setAuthorizationHeader(isClient); // Update the relevant header
};

// Method for POST requests
export const postMethode = async (url, data) => {
    // Determine if it's a client or admin login route
    const isClient = url === authClientRoute;
    setAuthorizationHeader(isClient); // Set the relevant header
    const response = await axios.post(url, data);

    // Save the correct token based on the URL
    if (url === authAdminRoute) {
        saveToken(response.data.token, "token", false);
    } else if (url === authClientRoute) {
        saveToken(response.data.tokenClient, "tokenClient", true);
    }
    return response;
};

// Other HTTP methods
export const getMethode = async (url, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.get(url);
};

export const putMethode = async (url, data, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.put(url, data);
};

export const patchMethode = async (url, data, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.patch(url, data);
};

export const deleteMethode = async (url, isClient = false) => {
    setAuthorizationHeader(isClient);
    return await axios.delete(url);
};
