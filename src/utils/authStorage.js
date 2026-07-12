const AUTH_STORAGE_KEY = "auth";

const isValidAuth = (authData) =>
  Boolean(
    authData &&
      typeof authData === "object" &&
      typeof authData.token === "string" &&
      authData.token.trim() &&
      authData.user &&
      typeof authData.user === "object" &&
      typeof authData.user._id === "string" &&
      authData.user._id.trim(),
  );

export const getStoredAuth = () => {
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedAuth) return null;

  try {
    const authData = JSON.parse(savedAuth);

    if (isValidAuth(authData)) return authData;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
};

export const saveStoredAuth = (authData) => {
  if (!isValidAuth(authData)) {
    throw new Error("Invalid authentication response");
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
