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
async function refreshToken() {
  const res = await fetch("http://localhost:8080/auth/refresh", {
    method: "POST",
    credentials: "include", // 🔥 required
  });

  return res.ok;
}


export const api = async (
  path,
  { method = "GET", body, params, responseType = "json" } = {}
) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const url = `${API_BASE}${path}${buildQuery(params)}`;

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include", // 🔥 Send http-only cookies
    body: body ? JSON.stringify(body) : undefined,
  });


  if (res.status === 401 || res.status === 403){
    const refreshed=await refreshToken();
    if (refreshed){
      return await api(path, { method, body, params, responseType });
    }else{
      throw new Error("Session expired please login again");
    }
  }


  if (responseType === "blob") {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }
    return await res.blob();
  }

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
