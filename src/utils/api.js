import { getStoredAuth } from "./authStorage";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const getApiUrl = (path = "") => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    throw new Error("VITE_API_URL is not configured");
  }

  const apiUrl = new URL(configuredUrl);
  const isLocalDevelopment =
    import.meta.env.DEV && LOCAL_HOSTS.has(apiUrl.hostname);

  if (apiUrl.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error("VITE_API_URL must use HTTPS");
  }

  const baseUrl = apiUrl.href.replace(/\/+$/, "");
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";

  return `${baseUrl}${normalizedPath}`;
};

export const getAuthenticatedHeaders = () => {
  const authData = getStoredAuth();

  if (!authData?.token) {
    throw new Error("Authentication required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authData.token}`,
  };
};
