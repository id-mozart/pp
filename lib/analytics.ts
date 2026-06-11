/** Safe Plausible event helper — no-op until the script/domain is wired. */
export function track(name: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    plausible?: (n: string, o?: { props?: Record<string, string> }) => void;
  };
  try {
    w.plausible?.(name, props ? { props } : undefined);
  } catch {
    /* ignore */
  }
}
