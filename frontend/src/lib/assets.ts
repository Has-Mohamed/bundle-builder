const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export function resolveImageUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
