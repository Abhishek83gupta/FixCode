"use server";

import { prisma } from "@/lib/prisma";


export async function getUserExecutions(userId: string, paginationOpts: any) {
  try {
    // Fetch executions based on userId with pagination
    const executions = await prisma.codeExecution.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: paginationOpts.page * paginationOpts.pageSize,
      take: paginationOpts.pageSize,
    });
    return executions;
  } catch (error : any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getUserStats(userId: string) {
  try {
    // Get executions by userId
    const executions = await prisma.codeExecution.findMany({
      where: {
        userId: userId,
      },
    });

    // Get starred snippets
    const starredSnippets = await prisma.star.findMany({
      where: {
        userId: userId,
      },
    });

    // Get snippet details for language analysis
    const snippetIds = starredSnippets.map((star) => star.snippetId);
    const snippetDetails = await prisma.snippet.findMany({
      where: {
        id: { in: snippetIds },
      },
    });

    // Calculate most starred language
    const starredLanguages = snippetDetails.reduce((acc, curr) => {
      if (curr?.language) {
        acc[curr.language] = (acc[curr.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostStarredLanguage = Object.entries(starredLanguages)
      .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

    // Execution stats
    const last24Hours = executions.filter(
      (e) => new Date(e.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const languageStats = executions.reduce((acc, curr) => {
      acc[curr.language] = (acc[curr.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const languages = Object.keys(languageStats);
    const favoriteLanguage =
      languages.length > 0
        ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
        : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  } catch (error:any) {
    console.error(error);
    return { error: error.message };
  }
}
