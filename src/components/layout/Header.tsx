import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";

export const Header = () => {
  const { data } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b-2 px-4 md:h-20 md:px-8">
      <Link
        href={"/"}
        className="text-2xl font-bold hover:cursor-pointer md:text-3xl"
      >
        Ask Kreate
      </Link>

      <div className="flex gap-4">
        {data?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={data?.user.image || ""} />
                <AvatarFallback className="font-bold">
                  {data?.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn("google")}>Sign In</Button>
        )}
      </div>
    </header>
  );
};
