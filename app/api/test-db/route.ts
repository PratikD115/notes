import db from "@/lib/db";

export async function GET() {
  try {
    const rows = await db.$queryRaw<{ result: number }[]>`SELECT 1 AS result`;

    return Response.json({
      success: true,
      message: "PostgreSQL connected successfully",
      rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "PostgreSQL connection failed" },
      { status: 500 },
    );
  }
}
