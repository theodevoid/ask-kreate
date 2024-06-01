import Link from "next/link";
import { type PropsWithChildren } from "react";

const SidebarItem: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Link href="/">
      <div className="p-4 font-bold hover:cursor-pointer hover:bg-accent">
        {children}
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="lg:w-[280px] lg:border-r-2">
      <SidebarItem>Item here</SidebarItem>
    </aside>
  );
};
