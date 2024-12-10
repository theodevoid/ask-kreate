import Link from "next/link";

export const Header = () => {
  return (
    <header className="border-secondaryBlack flex h-16 items-center justify-between border-b-2 bg-white px-4 md:h-20 md:px-8">
      <Link
        href={"/dashboard"}
        className="text-2xl font-bold text-primary hover:cursor-pointer md:text-3xl"
      >
        Ask Kreate
      </Link>
    </header>
  );
};
