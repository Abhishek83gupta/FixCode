"use client";

import { useEffect, useState } from "react";
import Header from "./_components/Header";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import {
  EditorPanelSkeleton,
  OutputPanelSkeleton,
} from "./_components/EditorPanelSkeleton"; 

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <>
             <EditorPanelSkeleton />
              <OutputPanelSkeleton />
            </>
          ) : (
            <>
             <EditorPanel />
             <OutputPanel/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
