// src/utils/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token) {
  if (token) {
    // Always send Bearer (and backend already supports this format)
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}

export default API;
