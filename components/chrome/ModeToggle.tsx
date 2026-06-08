"use client";

import { useConcept } from "@/components/providers/ConceptProvider";
import { CONCEPTS } from "@/lib/concepts";
import { Sun, Moon } from "@/components/ui/icons";

/**
 * Light / dark switcher. Only shown for concepts that ship both modes
 * (currently the working "Concept" version) so the 39 bespoke palettes
 * stay untouched.
 */
export function ModeToggle() {
  const { concept, mode, toggleMode } = useConcept();
  const supports = CONCEPTS.find((c) => c.id === concept)?.modes;
  if (!supports) return null;

  const isDark = mode === "dark";
  return (
    <button
      onClick={toggleMode}
      aria-label={isDark ? "Увімкнути світлу версію" : "Увімкнути темну версію"}
      title={isDark ? "Світла версія" : "Темна версія"}
      className="grid h-10 w-10 place-items-center rounded-full border border-line/70 text-ink transition-colors duration-300 hover:border-gold/50 hover:text-gold"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
