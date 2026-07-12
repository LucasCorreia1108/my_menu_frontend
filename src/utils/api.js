const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const requestJson = async (path, options = {}) => {
  const { body, headers, ...fetchOptions } = options;
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  return response.json();
};
