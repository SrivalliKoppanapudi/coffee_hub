// src/utils/api.js
export const API_BASE = "http://localhost:8080";

function buildQuery(params) {
  if (!params) return "";
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join("&");
  return query ? `?${query}` : "";
}

export const api = async (
  path,
  { method = "GET", token = localStorage.getItem("token"), body, params } = {}
) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  console.log(token);
  if (token) headers.Authorization=`Bearer ${token}`;

  const url = `${API_BASE}${path}${buildQuery(params)}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* fallback */
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) || text || "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const get = (path, opts = {}) => api(path, { ...opts, method: "GET" });
export const post = (path, body, opts = {}) =>
  api(path, { ...opts, method: "POST", body });
export const put = (path, body, opts = {}) =>
  api(path, { ...opts, method: "PUT", body });
export const del = (path, opts = {}) =>
  api(path, { ...opts, method: "DELETE" });
