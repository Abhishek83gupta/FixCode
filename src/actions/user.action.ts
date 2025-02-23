"use server";

import { prisma } from "@/lib/prisma";

export async function getUser(userId: string) {
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user || null;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return { error: error.message };
  }
}
