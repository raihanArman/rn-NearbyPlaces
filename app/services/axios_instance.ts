import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";


export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
