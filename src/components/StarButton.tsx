import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react"; // or your session management hook
import { isSnippetStarred, getSnippetStarCount, starSnippet } from "@/actions/star.action"; // Import your API functions

function StarButton({ snippetId }: { snippetId: string }) {
  const { data: session, status } = useSession();
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  const fetchData = async () => {
    if (session && session.user) {
      const starred = await isSnippetStarred(snippetId);
      const count = await getSnippetStarCount(snippetId);
      setIsStarred(starred);
      setStarCount(count);
    }
  };

  const handleStar = async () => {
    if (!session || !session.user) return;

    const result = await starSnippet(snippetId);

    if (result.status === 201) {
      // Snippet was starred successfully
      setIsStarred(true);
      setStarCount((prevCount) => prevCount + 1); // Increment the count
    } else if (result.status === 200) {
      // Snippet was unstarred successfully
      setIsStarred(false);
      setStarCount((prevCount) => Math.max(0, prevCount - 1)); // Prevent negative count
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, snippetId]);

  return (
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
        transition-all duration-200 ${
          isStarred
            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
        }`}
      onClick={handleStar}
    >
      <Star
        className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
      />
      <span className={`text-xs font-medium ${isStarred ? "text-yellow-500" : "text-gray-400"}`}>
        {starCount}
      </span>
    </button>
  );
}

export default StarButton;
