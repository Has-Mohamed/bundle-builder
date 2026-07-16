import { persistedStateSchema, type PersistedState } from "../data/schema";

const STORAGE_KEY = "bundle-builder:saved-system";

export function saveSystem(
  state: Omit<PersistedState, "version" | "savedAt">,
): void {
  const payload: PersistedState = {
    version: 1,
    savedAt: new Date().toISOString(),
    ...state,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Returns null if nothing was saved, or if what's there fails validation. */
export function loadSystem(): PersistedState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const result = persistedStateSchema.safeParse(parsed);
    if (!result.success) {
      console.warn(
        "Saved system failed validation, ignoring it.",
        result.error.flatten(),
      );
      return null;
    }
    return result.data;
  } catch {
    console.warn("Saved system was not valid JSON, ignoring it.");
    return null;
  }
}

export function clearSavedSystem(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedSystem(): boolean {
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}
