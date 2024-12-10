import { api } from "~/utils/api";

export default function Home() {
  const { data: hello } = api.post.hello.useQuery({ text: "helloo" });

  return (
    <>
      <h2>{hello?.greeting}</h2>
    </>
  );
}
