import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "", // Set in your .env
  // timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
