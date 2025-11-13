import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export async function GET() {
  const users = await prisma.users.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error?.flatten() },
      { status: 400 }
    );
  }
  const user = await prisma.users.create({ data: parsed.data });
  return NextResponse.json(user);
}
