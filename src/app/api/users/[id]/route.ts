import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";
import { z } from "zod";

// Schema Zod para validação
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await prisma.users.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Existe?
  const existing = await prisma.users.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  // Atualizar
  const updated = await prisma.users.update({
    where: { id: Number(id) },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.users.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Usuário deletado" });
}
