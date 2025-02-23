"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Check if a snippet is starred by the user
export async function isSnippetStarred(snippetId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;

  const star = await prisma.star.findFirst({
    where: {
      userId: session.user.id,
      snippetId,
    },
  });

  return !!star;
}

// Get the star count for a snippet
export async function getSnippetStarCount(snippetId: string) {
  const stars = await prisma.star.findMany({
    where: {
      snippetId,
    },
  });

  return stars.length;
}

// Star or unstar a snippet
export async function starSnippet(snippetId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Unauthorized", status: 401 };

  // Check if the snippet is already starred by the user
  const existingStar = await prisma.star.findUnique({
    where: {
      userId_snippetId: {
        userId: session.user.id,
        snippetId,
      },
    },
  });

  if (existingStar) {
    // If already starred, unstar it
    await prisma.star.delete({
      where: {
        userId_snippetId: {
          userId: session.user.id,
          snippetId,
        },
      },
    });
    return { message: "Snippet unstarred successfully", status: 200 };
  } else {
    // If not starred, star the snippet
    await prisma.star.create({
      data: {
        userId: session.user.id,
        snippetId,
      },
    });
    return { message: "Snippet starred successfully", status: 201 };
  }
}

// Get all starred snippets  // Dashboard
export async function getStarredSnippets() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    // Get starred snippets by user
    const stars = await prisma.star.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Fetch snippet details for each starred snippet
    const snippets = await Promise.all(
      stars.map((star) =>
        prisma.snippet.findUnique({ where: { id: star.snippetId } })
      )
    );

    return snippets.filter(Boolean); // Return only valid snippets
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
