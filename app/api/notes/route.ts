import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getUserId() {
  const value = (await cookies()).get("userId")?.value;
  const userId = Number(value);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Please log in" }, { status: 401 });
  return NextResponse.json({ data: await prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }) });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ message: "Please log in" }, { status: 401 });
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!title || !text) return NextResponse.json({ message: "Title and text are required" }, { status: 400 });
  return NextResponse.json({ data: await prisma.note.create({ data: { title, text, userId } }) }, { status: 201 });
}
