import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const age = typeof body.age === "number" ? body.age : Number(body.age);

    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser && (!name || !Number.isInteger(age) || age < 0)) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const user = existingUser ?? await prisma.user.create({ data: { email, name, age, role: 2 } });
    const response = NextResponse.json({ exists: Boolean(existingUser), user }, { status: existingUser ? 200 : 201 });
    response.cookies.set("userId", String(user.id), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 500 },
    );
  }
}
