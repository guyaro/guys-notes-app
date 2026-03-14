import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function getPublicUrl(filePath) {
  const { VITE_SUPABASE_URL } = import.meta.env
  return `${VITE_SUPABASE_URL}/storage/v1/object/public/notes/${filePath}`
}
