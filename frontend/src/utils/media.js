// Turns a backend-relative upload path (e.g. "/uploads/abc.jpg") into a full URL
// pointing at the backend server, since frontend and backend are on different
// domains in production.
const API_BASE = import.meta.env.VITE_API_URL || "/api";
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}