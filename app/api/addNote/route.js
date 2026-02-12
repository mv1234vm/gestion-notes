import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function POST(req) {
  const { user_id, matiere, note, coef } = await req.json();

  if (!user_id || !matiere || !note || !coef) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const files = await list();
  const file = files.blobs.find(b => b.pathname === "notes.csv");

  let csv = "user_id,matiere,note,coef\n";
  if (file) {
    const existing = await fetch(file.url).then(r => r.text());
    csv = existing;
  }

  const line = `${user_id},${matiere},${note},${coef}\n`;
  const updated = csv + line;

  await put("notes.csv", updated, {
    access: "public",
    contentType: "text/csv",
  });

  return NextResponse.json({ ok: true });
}
