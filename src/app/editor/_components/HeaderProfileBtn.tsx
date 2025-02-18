"use client";

import { Button } from "@/components/ui/button";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderProfileBtn() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    router.push("/");
  };

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  return (
    <div>
      {initialLoading && status === "loading" ? (
        <BiLoaderCircle className="animate-spin text-blue-600 to-blue-500" />
      ) : !session ? (
        <Button
          onClick={() => signIn()}
          className="text-sm font-medium relative z-10 group-hover:text-white
               hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden bg-gradient-to-r from-blue-500/10 
                to-purple-500/10"
        >
          Login
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="border-2 border-blue-400/20 hover:border-blue-600 to-blue-500 transition-colors">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="bg-purple-500/10 text-blue-600">
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-[#0a0a0f]/80 shadow-lg rounded-xl border border-gray-700 p-2 transition-all duration-300"
          >
            <DropdownMenuItem
              onSelect={() => router.push("/profile")}
              className="cursor-pointer px-4 py-2 !bg-[#0a0a0f]/80 !text-white hover:!bg-blue-500 rounded-lg transition-all"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleLogout}
              className="cursor-pointer px-4 py-2 !bg-[#0a0a0f]/80 !text-white hover:!bg-red-500 rounded-lg transition-all"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
