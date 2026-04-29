import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-red-900/50 text-red-200 border-red-700';
    case 'high': return 'bg-orange-900/50 text-orange-200 border-orange-700';
    case 'medium': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700';
    case 'low': return 'bg-blue-900/50 text-blue-200 border-blue-700';
    default: return 'bg-gray-900/50 text-gray-200 border-gray-700';
  }
}
