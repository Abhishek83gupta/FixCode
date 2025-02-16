import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Fetch the session using NextAuth
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { language, output, error, code} = await req.json();

    // Validate required fields
    if (!language) {
      return NextResponse.json(
        { error: "Language are required fields." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    // Create a new code execution record
    const codeExecution = await prisma.codeExecution.create({
      data: {
        userId: session.user.id, // User ID from the session
        language,
        output,
        error,
        code
      },
    });

    // Respond with the created record
    return NextResponse.json({
      message: "Code execution saved successfully",
      codeExecution,
    });
  } catch (err) {
    console.error("Error saving code execution:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}