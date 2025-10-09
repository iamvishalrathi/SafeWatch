// src/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Your Flask backend URL
  timeout: 100000,
});

export default instance;
