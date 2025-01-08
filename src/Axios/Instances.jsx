import axios from "axios";

const baseUrl = "http://localhost:8000/";

// Axios instance for regular API calls
const instance = axios.create({
    baseURL: baseUrl,
    headers: {"Content-Type": "application/json"},
  });
  
  // Axios instance for No Authentication
export const noAuthInstance = axios.create({
    baseURL: baseUrl,
    headers: {"Content-Type": "application/json"},
  });

  export default instance;