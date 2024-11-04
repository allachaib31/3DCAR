import axios from "axios";
import { authAdminRoute, authClientRoute } from "./apiRoutes";

axios.defaults.withCredentials = true;

// Function to get the token from local storage
const getToken = () => {
    return localStorage.getItem("token");
};
const getTokenClient = () => {
    return localStorage.getItem("tokenClient");
};

// Function to set the token in Axios headers
const setAuthorizationHeader = () => {
    const token = getToken();
    const tokenClient = getTokenClient();
    if (token) {
        axios.defaults.headers.common["Authorization"] = `${token}`;
        axios.defaults.headers.common["AuthorizationClient"] = `${tokenClient}`;
    } else {
        delete axios.defaults.headers.common["Authorization"]; // Remove header if no token
        delete axios.defaults.headers.common["AuthorizationClient"]; // Remove header if no token
    }
};

export const saveToken = (token, name) => {
    localStorage.setItem(name, token);
    setAuthorizationHeader(); // Set the header after saving the token
};

export const postMethode = async (url, data) => {
    setAuthorizationHeader(); // Set the header before the request
    const response = await axios.post(url, data);
    if(url == authAdminRoute) saveToken(response.data.token, "token"); // Save the token from response
    else if (url == authClientRoute) saveToken(response.data.tokenClient, "tokenClient"); // Save the token client from response
    return response;
};

export const getMethode = async (url) => {
    setAuthorizationHeader(); // Set the header before the request
    const response = await axios.get(url);
    return response;
};

export const putMethode = async (url, data) => {
    setAuthorizationHeader(); // Set the header before the request
    const response = await axios.put(url, data);
    return response;
};

export const patchMethode = async (url, data) => {
    setAuthorizationHeader(); // Set the header before the request
    const response = await axios.patch(url, data);
    return response;
};

export const deleteMethode = async (url) => {
    setAuthorizationHeader(); // Set the header before the request
    const response = await axios.delete(url);
    return response;
};
