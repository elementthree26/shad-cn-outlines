/**
 * Lightweight activity log stored in localStorage per project.
 */

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  category: "page" | "section" | "style" | "phase" | "redirect" | "export" | "project";
}

const STORAGE_PREFIX = "shad-cn-activity-";
const MAX_ENTRIES = 100;

function getKey(projectId: string): string {
  return `${STORAGE_PREFIX}${projectId}`;
}

export function getActivityLog(projectId: string): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getKey(projectId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logActivity(
  projectId: string,
  action: string,
  detail: string,
  category: ActivityEntry["category"] = "project"
) {
  if (typeof window === "undefined") return;
  const log = getActivityLog(projectId);
  const entry: ActivityEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    detail,
    category,
  };
  log.unshift(entry);
  // Keep only the last MAX_ENTRIES
  const trimmed = log.slice(0, MAX_ENTRIES);
  localStorage.setItem(getKey(projectId), JSON.stringify(trimmed));
}

export function clearActivityLog(projectId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getKey(projectId));
}
