import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "portfolio:motion";
const MOTION_EVENT = "portfolio-motion-change";

type MotionPreference = "full" | "reduced";

function readStoredPreference(): MotionPreference {
  if (typeof window === "undefined") {
    return "full";
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const preference = raw === "reduced" ? "reduced" : "full";
  window.document.documentElement.setAttribute("data-motion", preference);
  return preference;
}

function writePreference(value: MotionPreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.document.documentElement.setAttribute("data-motion", value);
  window.dispatchEvent(new Event(MOTION_EVENT));
}

export function useMotionPreference() {
  const [preference, setPreference] = useState<MotionPreference>(() => readStoredPreference());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncPreference = () => setPreference(readStoredPreference());
    syncPreference();

    window.addEventListener("storage", syncPreference);
    window.addEventListener(MOTION_EVENT, syncPreference);
    return () => {
      window.removeEventListener("storage", syncPreference);
      window.removeEventListener(MOTION_EVENT, syncPreference);
    };
  }, []);

  const shouldReduceMotion = useMemo(() => preference === "reduced", [preference]);

  const toggleMotion = () => {
    const nextPreference: MotionPreference = preference === "reduced" ? "full" : "reduced";
    writePreference(nextPreference);
    setPreference(nextPreference);
  };

  useEffect(() => {
    writePreference(preference);
  }, [preference]);

  return {
    shouldReduceMotion,
    preference,
    toggleMotion,
  };
}
