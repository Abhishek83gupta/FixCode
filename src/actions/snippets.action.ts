"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Create a new snippet
export async function createSnippet(
  title: string,
  language: string,
  code: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Unauthorized", status: 401 };

  if (!title || !language || !code)
    return { error: "Title, language, and code are required", status: 400 };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found", status: 401 };

  const snippet = await prisma.snippet.create({
    data: {
      userId: session.user.id,
      userName: user.name ?? "",
      title,
      language,
      code,
    },
  });

  return { message: "Snippet created successfully", snippet };
}

// Fetch all snippets
export async function getSnippets() {
  const snippets = await prisma.snippet.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { message: "Snippets fetched successfully", snippets };
}

export async function deleteSnippet(snippetId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Unauthorized", status: 401 };

  if (!snippetId) return { error: "Snippet ID is required", status: 400 };

  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
    include: { SnippetComment: true, Star: true },
  });

  if (!snippet) return { error: "Snippet not found", status: 404 };
  if (snippet.userId !== session.user.id)
    return { error: "Not authorized", status: 403 };

  await prisma.snippetComment.deleteMany({ where: { snippetId } });
  await prisma.star.deleteMany({ where: { snippetId } });
  await prisma.snippet.delete({ where: { id: snippetId } });

  return { message: "Snippet deleted successfully" };
}

export async function getSnippetById(snippetId: string) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      include: {
        Star: true,
        SnippetComment: true,
      },
    });

    if (!snippet) throw new Error("Snippet not found");

    return { message: "Snippet fetched successfully", snippet };
  } catch (error:any) {
    return { error: error.message, status: 404 };
  }
}
