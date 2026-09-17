import { useSyncExternalStore } from "react";
import { defaultData, type DemoData } from "@/data/defaults";

const DATA_KEY = "sartaj-demo-data-v1";
const AUTH_KEY = "sartaj-demo-auth-v1";

export const DEMO_EMAIL = "admin@sartajsolar.in";
export const DEMO_PASSWORD = "admin123";

let cache: DemoData | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getData(): DemoData {
  if (typeof window === "undefined") return defaultData;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoData>;
      cache = { ...defaultData, ...parsed };
    } else {
      cache = defaultData;
      window.localStorage.setItem(DATA_KEY, JSON.stringify(cache));
    }
  } catch {
    cache = defaultData;
  }
  return cache;
}

export function setData(updater: (current: DemoData) => DemoData) {
  const next = updater(getData());
  cache = next;
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(next));
  } catch {
    /* demo only */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function useDemoData(): DemoData {
  return useSyncExternalStore(
    subscribe,
    getData,
    () => defaultData,
  );
}

export function resetDemoData() {
  cache = defaultData;
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(defaultData));
  } catch {
    /* demo only */
  }
  emit();
}

/* ---------- collections ---------- */

type Collection = "services" | "products" | "projects" | "gallery" | "testimonials";

export function makeId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export type WithId = { id: string } & Record<string, unknown>;

export function saveItem(collection: Collection, item: WithId) {
  setData((data) => {
    const list = data[collection] as unknown as WithId[];
    const exists = list.some((entry) => entry.id === item.id);
    const next = exists
      ? list.map((entry) => (entry.id === item.id ? { ...entry, ...item } : entry))
      : [{ ...item, id: item.id || makeId() }, ...list];
    return { ...data, [collection]: next } as DemoData;
  });
}


export function deleteItem(collection: Collection, id: string) {
  setData((data) => ({
    ...data,
    [collection]: (data[collection] as { id: string }[]).filter((e) => e.id !== id),
  }) as DemoData);
}

export function toggleItem(collection: Collection, id: string) {
  setData((data) => ({
    ...data,
    [collection]: (data[collection] as { id: string; active: boolean }[]).map((e) =>
      e.id === id ? { ...e, active: !e.active } : e,
    ),
  }) as DemoData);
}

/* ---------- leads ---------- */

export function addLead(lead: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}) {
  setData((data) => ({
    ...data,
    leads: [
      {
        ...lead,
        id: makeId(),
        date: new Date().toISOString(),
        status: "New" as const,
      },
      ...data.leads,
    ],
  }));
}

export function setLeadStatus(id: string, status: "New" | "Contacted" | "Closed") {
  setData((data) => ({
    ...data,
    leads: data.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
  }));
}

export function deleteLead(id: string) {
  setData((data) => ({ ...data, leads: data.leads.filter((l) => l.id !== id) }));
}

/* ---------- settings ---------- */

export function saveSettings(settings: DemoData["settings"]) {
  setData((data) => ({ ...data, settings }));
}

/* ---------- demo auth ---------- */

const authListeners = new Set<() => void>();

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function login(email: string, password: string) {
  if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, "true");
    authListeners.forEach((l) => l());
    return true;
  }
  return false;
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY);
  authListeners.forEach((l) => l());
}

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuth,
    isLoggedIn,
    () => false,
  );
}
