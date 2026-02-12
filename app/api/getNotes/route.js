import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("u");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const files = await list();
  const file = files.blobs.find(b => b.pathname === "notes.csv");

  if (!file) {
    return NextResponse.json({ notes: [] });
  }

  const csv = await fetch(file.url).then(r => r.text());
  const lines = csv.split("\n").slice(1);

  const notes = lines
    .map(line => line.split(","))
    .filter(parts => parts.length >= 4 && parts[0] === user_id)
    .map(parts => ({
      user_id: parts[0],
      matiere: parts[1],
      note: parts[2],
      coef: parts[3],
    }));

  return NextResponse.json({ notes });
}
