import axios from "axios";


export const AxiosInstance = axios.create({
    baseURL: "https://dummyjson.com/",
    timeout: 5000,
    headers:{'Content-Type': 'application/json'}
})