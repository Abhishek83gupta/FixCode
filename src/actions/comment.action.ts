"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function getCommentsForSnippet(snippetId: string) {
  try {
    // Query the database to get comments associated with the snippetId
    const comments = await prisma.snippetComment.findMany({
      where: { snippetId },
      orderBy: { createdAt: "desc" }, 
    });
    return { message: "Comments fetched successfully", comments };
  } catch (error:any) {
    return { error: error.message, status: 404 };
  }
}

export async function addComment(snippetId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Unauthorized", status: 401 };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found", status: 404 };

  const comment = await prisma.snippetComment.create({
    data: {
      snippetId,
      userId: session.user.id,
      userName: user.name ?? " ",
      content,
    },
  });

  return { message: "Comment added successfully", comment };
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Unauthorized", status: 401 };

  const comment = await prisma.snippetComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) return { error: "Comment not found", status: 404 };

  if (comment.userId !== session.user.id) {
    return { error: "Not authorized to delete this comment", status: 403 };
  }

  await prisma.snippetComment.delete({ where: { id: commentId } });

  return { message: "Comment deleted successfully" };
}
