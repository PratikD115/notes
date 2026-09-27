import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const userId = Number((await cookies()).get("userId")?.value);
  if (!Number.isInteger(userId) || userId < 1) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === 1;
}

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { id: "asc" } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { name, email, age } = body as Record<string, unknown>;
    const parsedAge = typeof age === "number" ? age : Number(age);

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      typeof email !== "string" ||
      email.trim().length === 0 ||
      !Number.isInteger(parsedAge) ||
      parsedAge < 0
    ) {
      return NextResponse.json(
        { message: "Name, email, and a valid age are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.trim(), age: parsedAge },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
  }
}
