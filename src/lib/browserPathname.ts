const listeners = new Set<() => void>();

let historyPatched = false;

function notifyAll() {
  // Defer so we never call useSyncExternalStore subscribers synchronously from
  // history.pushState/replaceState (can run during React useInsertionEffect).
  queueMicrotask(() => {
    listeners.forEach((listener) => listener());
  });
}

function ensureHistoryPatched() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const origPush = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);

  history.pushState = (...args: Parameters<History["pushState"]>) => {
    origPush(...args);
    notifyAll();
  };

  history.replaceState = (...args: Parameters<History["replaceState"]>) => {
    origReplace(...args);
    notifyAll();
  };
}

/**
 * Subscribe to pathname changes from the browser (popstate + SPA history updates).
 * For use with useSyncExternalStore so layout-level UI stays in sync in production.
 */
export function subscribeToBrowserPathname(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  listeners.add(onStoreChange);
  ensureHistoryPatched();

  const onPopState = () => {
    queueMicrotask(() => onStoreChange());
  };
  window.addEventListener("popstate", onPopState);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("popstate", onPopState);
  };
}

/** Strip trailing slash except for root so `/menu/` matches `/menu`. */
export function normalizePathname(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}
