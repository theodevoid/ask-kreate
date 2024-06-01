import { HeadMetaData } from "~/components/layout/HeadMetaData";
import { Button } from "~/components/ui/button";
import { Sidebar } from "~/features/dashboard/components";

export default function Home() {
  return (
    <>
      <HeadMetaData />
      <div className="flex h-[calc(100vh-5rem)]">
        <Sidebar />
        <main className="flex flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <Button>Test</Button>
          </div>
        </main>
      </div>
    </>
  );
}
