import axios from "axios";

/**
 * Shared Axios instance for future NestJS API integration.
 * Base URL and auth interceptors will be wired in a later phase.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Centralized error handling placeholder for NestJS responses.
    return Promise.reject(error);
  }
);
