/**
 * Theme store — dark (default) | light.
 * Persisted in localStorage, applied as a class on <html>.
 * Follows the same useSyncExternalStore pattern as sound.ts.
 */

export type Theme = "dark" | "light";

const KEY = "divi-theme";
let current: Theme = "dark";

const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}

export function subscribeTheme(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getThemeSnapshot(): Theme {
  return current;
}

function applyClass(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", t === "light");
}

export function loadThemePref(): void {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark") {
    current = saved;
    applyClass(current);
    notify();
  }
}

export function setTheme(t: Theme): void {
  current = t;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, t);
  }
  applyClass(t);
  notify();
}
