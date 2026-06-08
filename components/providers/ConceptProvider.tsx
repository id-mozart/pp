"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  VISIBLE_CONCEPT_IDS,
  DEFAULT_CONCEPT,
  DEFAULT_MODE,
  MODE_STORAGE_KEY,
  STORAGE_KEY,
  isConceptId,
  isMode,
  type ConceptId,
  type Mode,
} from "@/lib/concepts";

interface ConceptContextValue {
  concept: ConceptId;
  setConcept: (c: ConceptId) => void;
  cycle: () => void;
  cyclePrev: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

const ConceptContext = createContext<ConceptContextValue | null>(null);

function apply(c: ConceptId) {
  document.documentElement.setAttribute("data-concept", c);
  try {
    localStorage.setItem(STORAGE_KEY, c);
  } catch {
    /* ignore */
  }
}

function applyMode(m: Mode) {
  document.documentElement.setAttribute("data-mode", m);
  try {
    localStorage.setItem(MODE_STORAGE_KEY, m);
  } catch {
    /* ignore */
  }
}

export function ConceptProvider({ children }: { children: React.ReactNode }) {
  const [concept, setConceptState] = useState<ConceptId>(DEFAULT_CONCEPT);
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

  // Sync from the value the no-flash script already applied / localStorage.
  useEffect(() => {
    const fromDom = document.documentElement.getAttribute("data-concept");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const initial = isConceptId(stored)
      ? stored
      : isConceptId(fromDom)
        ? fromDom
        : DEFAULT_CONCEPT;
    setConceptState(initial);
    document.documentElement.setAttribute("data-concept", initial);

    const modeFromDom = document.documentElement.getAttribute("data-mode");
    let storedMode: string | null = null;
    try {
      storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const initialMode = isMode(storedMode)
      ? storedMode
      : isMode(modeFromDom)
        ? modeFromDom
        : DEFAULT_MODE;
    setModeState(initialMode);
    document.documentElement.setAttribute("data-mode", initialMode);
  }, []);

  const setConcept = useCallback((c: ConceptId) => {
    setConceptState(c);
    apply(c);
  }, []);

  const cycle = useCallback(() => {
    setConceptState((prev) => {
      const ids = VISIBLE_CONCEPT_IDS;
      const i = ids.indexOf(prev);
      const next = ids[(i + 1 + ids.length) % ids.length];
      apply(next);
      return next;
    });
  }, []);

  const cyclePrev = useCallback(() => {
    setConceptState((prev) => {
      const ids = VISIBLE_CONCEPT_IDS;
      const i = ids.indexOf(prev);
      const next = ids[(i - 1 + ids.length) % ids.length];
      apply(next);
      return next;
    });
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    applyMode(m);
  }, []);

  // Keep the side effect OUT of the state updater (StrictMode double-invokes
  // updaters in dev, which would flip the mode straight back).
  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  return (
    <ConceptContext.Provider
      value={{ concept, setConcept, cycle, cyclePrev, mode, setMode, toggleMode }}
    >
      {children}
    </ConceptContext.Provider>
  );
}

export function useConcept() {
  const ctx = useContext(ConceptContext);
  if (!ctx) throw new Error("useConcept must be used within ConceptProvider");
  return ctx;
}
