const authStorageKey = "auth";
const authChangedEvent = "authChanged";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(authChangedEvent));
};

export const getStoredAuth = () => {
  const savedAuth = localStorage.getItem(authStorageKey);

  if (!savedAuth) return null;

  try {
    return JSON.parse(savedAuth);
  } catch {
    return null;
  }
};

export const saveStoredAuth = (authData) => {
  localStorage.setItem(authStorageKey, JSON.stringify(authData));
  notifyAuthChanged();
};

export const clearStoredAuth = () => {
  localStorage.removeItem(authStorageKey);
  notifyAuthChanged();
};

export const subscribeToAuthChanges = (listener) => {
  window.addEventListener(authChangedEvent, listener);
  return () => window.removeEventListener(authChangedEvent, listener);
};
