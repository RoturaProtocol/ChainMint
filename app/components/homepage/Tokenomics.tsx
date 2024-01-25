import Image from "next/image";
import React from "react";
import { CircleDollarSign } from "lucide-react";

export default function Tokenomics() {
  return (
    <section className="w- space-y-8 pb-24">
      <div className="text-5xl text-center font-bold">Tokenomics</div>
      <div className="px-4 py-2 flex flex-wrap md:flex-nowrap justify-center w-fit mx-auto gap-8 items-center">
        <Card
          bg="linear-gradient(45deg, rgb(240, 255, 199), rgb(255, 153, 206))"
          title="Total Supply"
          subTitle="42,000,000,000"
          desc="Elon Musk, the modern-day da Vinci, has left his indelible mark on the
          very fabric of our universe. With a total supply of 42 billion tokens,
          BoxingToken mirrors Musk's boundless ambition, as he rockets
          humanity toward the stars with SpaceX. Each token is a testament to
          Musk's audacity, a fragment of his celestial dreams distilled
          into a digital masterpiece."
        />
        <Card
          bg="linear-gradient(45deg, rgb(194, 194, 255), rgb(255, 242, 199))"
          title="Tax"
          subTitle="1% - The Golden Tribute"
          desc="Elon Musk, the master of innovation, has infused
          BoxingToken's 1% tax with a touch of genius. Like his
          revolutionary electric vehicles, this tax is an
          engineering marvel – seemingly minor, yet capable of
          driving immense change. It's the Muskian touch that
          ensures every transaction charges up the crypto
          ecosystem, just as Tesla's charging stations power
          electric mobility."
        />
      </div>
      <div className="px-4 py-2 flex flex-wrap md:flex-nowrap justify-center w-fit mx-auto gap-8 items-center">
        <Card
          bg="linear-gradient(135deg, rgb(255, 194, 196), rgb(246, 194, 255))"
          title="Name"
          subTitle="TUI"
          desc={`Just as Mark Zuckerberg revolutionized social
          connectivity with Facebook's algorithmic prowess,
          the name "BoxingToken" resonates with a
          streamlined elegance that only Zuck could
          conceive. It's a moniker that encapsulates the
          drama and excitement of the ring, designed with
          the same algorithmic precision that powers
          Facebook's engagement metrics.`}
        />
        <Card
          bg="linear-gradient(180deg, rgb(199, 255, 242), rgb(187, 158, 255))"
          title="Max Wallet"
          subTitle="Mythic Boundaries"
          desc="Mark Zuckerberg's genius lies in setting boundaries
          that define user interactions on his platforms. In a
          parallel manner, the max wallet limit of BoxingToken
          establishes a strategic boundary, reflecting Zuck's
          knack for orchestrating controlled ecosystems. It's a
          digital garden where only the chosen flourish,
          resonating with the Zuckerberg ethos of curated
          connections."
        />
      </div>
    </section>
  );
}

type Card = {
  title: string;
  subTitle: string;
  desc: string;
  bg: string;
};

function Card({ title, subTitle, desc, bg }: Card) {
  return (
    <div
      style={{ backgroundImage: bg }}
      className="flex max-w-[500px] h-[350px] justify-center bg-white text-black rounded-lg px-8 py-3 m-auto"
    >
      <div className="my-auto">
        <div className="font-bold text-[16px]">{title}</div>
        <div className="text-2xl">{subTitle}</div>

        <p className="mt-3">{desc}</p>
      </div>
    </div>
  );
}
