import Image from "next/image";
import Hero from "./components/homepage/Hero";
import Introduction from "./components/homepage/Introduction";
import Tokenomics from "./components/homepage/Tokenomics";
import Roadmap from "./components/homepage/Roadmap";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="w-full mx-auto flex-col">
      <Hero />
      <Introduction />
      <Tokenomics />
      <Roadmap />
    </main>
  );
}
