import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const { data: hello } = api.post.hello.useQuery({ text: "helloo" });

  const router = useRouter();

  useEffect(() => {
    void router.replace("/dashboard");
  }, [router.isReady]);

  return (
    <>
      <h2>{hello?.greeting}</h2>
    </>
  );
}
