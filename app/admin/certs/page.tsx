import type { Metadata } from "next";
import { hasDb, listCertificates } from "@/lib/db";
import { CERT_DEFAULT, nextNumber, sanitizeCert, type Cert } from "@/lib/certs";
import { CertEditor } from "@/components/admin/CertEditor";

export const metadata: Metadata = {
  title: "Сертифікати — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function CertsPage() {
  const rows = await listCertificates();
  const saved = rows.map((r) => ({ ...sanitizeCert(r.data), id: r.id, number: r.number ?? "", updated_at: r.updated_at }));
  const initial: Cert = { ...CERT_DEFAULT, number: nextNumber(rows.map((r) => r.number)) };
  return <CertEditor initial={initial} saved={saved} dbReady={hasDb()} />;
}
