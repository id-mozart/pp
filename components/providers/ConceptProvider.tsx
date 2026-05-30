"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CONCEPT_IDS,
  DEFAULT_CONCEPT,
  STORAGE_KEY,
  isConceptId,
  type ConceptId,
} from "@/lib/concepts";

interface ConceptContextValue {
  concept: ConceptId;
  setConcept: (c: ConceptId) => void;
  cycle: () => void;
  cyclePrev: () => void;
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

export function ConceptProvider({ children }: { children: React.ReactNode }) {
  const [concept, setConceptState] = useState<ConceptId>(DEFAULT_CONCEPT);

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
  }, []);

  const setConcept = useCallback((c: ConceptId) => {
    setConceptState(c);
    apply(c);
  }, []);

  const cycle = useCallback(() => {
    setConceptState((prev) => {
      const next =
        CONCEPT_IDS[(CONCEPT_IDS.indexOf(prev) + 1) % CONCEPT_IDS.length];
      apply(next);
      return next;
    });
  }, []);

  const cyclePrev = useCallback(() => {
    setConceptState((prev) => {
      const i = CONCEPT_IDS.indexOf(prev);
      const next =
        CONCEPT_IDS[(i - 1 + CONCEPT_IDS.length) % CONCEPT_IDS.length];
      apply(next);
      return next;
    });
  }, []);

  return (
    <ConceptContext.Provider value={{ concept, setConcept, cycle, cyclePrev }}>
      {children}
    </ConceptContext.Provider>
  );
}

export function useConcept() {
  const ctx = useContext(ConceptContext);
  if (!ctx) throw new Error("useConcept must be used within ConceptProvider");
  return ctx;
}
