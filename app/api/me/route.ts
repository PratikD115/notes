import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = Number((await cookies()).get("userId")?.value);
  if (!Number.isInteger(userId) || userId < 1) return NextResponse.json({ message: "Please log in" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true } });
  if (!user) return NextResponse.json({ message: "Please log in" }, { status: 401 });
  return NextResponse.json({ data: user });
}
