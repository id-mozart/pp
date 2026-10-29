"use client";

/** Форма з підтвердженням перед надсиланням — для незворотних дій в адмінці. */
export function ConfirmForm({ action, message, children, className }: { action: string; message: string; children: React.ReactNode; className?: string }) {
  return (
    <form method="POST" action={action} className={className} onSubmit={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </form>
  );
}
