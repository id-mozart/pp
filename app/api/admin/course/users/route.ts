import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { createCourseUser, deleteCourseUser, getCourseUserByCode, hasDb, setCourseUserRevoked } from "@/lib/db";
import { normalizePhone } from "@/lib/courseProgress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURSE = "messages";
const BACK = "/admin/course";

function seeOther(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}

/** Код виду PAN-7K3MXQ: без 0/O, 1/I/L — учні вводять з телефону. */
function genCode() {
  const abc = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += abc[randomInt(abc.length)];
  return `PAN-${s}`;
}

/**
 * Учні курсу (адмінка, захищена middleware /api/admin):
 * action=create — новий учень з персональним кодом; revoke / restore — закрити/відновити доступ;
 * delete — видалити учня разом зі спробами тестів.
 */
export async function POST(req: Request) {
  if (!hasDb()) return seeOther(`${BACK}?err=nodb`);
  const form = await req.formData().catch(() => null);
  const action = String(form?.get("action") ?? "create");
  const id = String(form?.get("id") ?? "");

  if (action === "create") {
    const name = String(form?.get("name") ?? "").trim().slice(0, 120);
    const phone = normalizePhone(String(form?.get("phone") ?? "")).slice(0, 32);
    const note = String(form?.get("note") ?? "").trim().slice(0, 300);
    if (name.length < 2) return seeOther(`${BACK}?err=name`);
    let code = genCode();
    for (let i = 0; i < 5 && (await getCourseUserByCode(COURSE, code)); i++) code = genCode();
    const newId = await createCourseUser({ course: COURSE, code, name, phone, note });
    return seeOther(newId ? `${BACK}?new=${newId}#students` : `${BACK}?err=db`);
  }
  if (!/^[0-9a-f-]{36}$/.test(id)) return seeOther(`${BACK}?err=id`);
  if (action === "revoke") await setCourseUserRevoked(id, true);
  else if (action === "restore") await setCourseUserRevoked(id, false);
  else if (action === "delete") await deleteCourseUser(id);
  return seeOther(`${BACK}#students`);
}
