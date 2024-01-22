import Image from "next/image";
import React from "react";

export default function Introduction() {
  return (
    <section className="bg-black w-full py-24">
      <div className="container space-y-8 mx-auto px-4">
        <div className="text-5xl text-center text-white font-bold">
          Introduction
        </div>
        {/*<div className="flex flex-col md:flex-row items-center justify-center gap-8">*/}
        {/*  <div className="relative w-full sm:w-[500px] h-[450px]">*/}
        {/*    <Image*/}
        {/*      src="/images/musk-intro.jpg"*/}
        {/*      className="rounded-2xl"*/}
        {/*      fill*/}
        {/*      style={{ objectFit: "cover" }}*/}
        {/*      alt="logo"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <div className="relative w-full sm:w-[500px] h-[450px]">*/}
        {/*    <Image*/}
        {/*      src="/images/zuck-intro.jpg"*/}
        {/*      className="rounded-2xl"*/}
        {/*      fill*/}
        {/*      style={{ objectFit: "cover" }}*/}
        {/*      alt="logo"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="text-white space-y-4 text-[18px] mx-auto max-w-[1000px]">
          <p>The RTP-20 Protocol: Revolutionizing Tura Future</p>

          <p>High Performance & Scalability:</p>
          <p>RTP-20 aims for high performance and scalability through advanced consensus and network optimizations. Tura handles large transactions seamlessly, perfect for high-throughput blockchain apps and smart contracts.</p>

          <p>Security & Decentralization:</p>
          <p>RTP-20 prioritizes security with cutting-edge cryptography and decentralization. Tura decentralized network ensures reliability, avoiding single points of failure.</p>

          <p>Ecosystem Growth:</p>
          <p>RTP-20 enhances core tech and offers developer-friendly tools. This fosters the Tura ecosystem expansion, attracting developers and innovators.</p>

          <p>Community-Led Governance:</p>
          <p>RTP-20 adopts community-driven governance, involving members in decisions. This open approach encourages collaboration, keeping Tura aligned with user needs.
          </p>
        </div>
        {/*<div className="flex items-center flex-col md:flex-row justify-center gap-8">*/}
        {/*  <div className="relative  w-[400px] h-[350px] md:w-[325px] md:h-[250px]">*/}
        {/*    <Image*/}
        {/*      src="/images/intro1.png"*/}
        {/*      className="rounded-xl"*/}
        {/*      fill*/}
        {/*      style={{ objectFit: "cover" }}*/}
        {/*      alt="logo"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <div className="relative w-[400px] h-[350px] md:w-[325px] md:h-[250px]">*/}
        {/*    <Image*/}
        {/*      src="/images/intro2.png"*/}
        {/*      className="rounded-xl"*/}
        {/*      fill*/}
        {/*      style={{ objectFit: "cover" }}*/}
        {/*      alt="logo"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <div className="relative w-[400px] h-[350px] md:w-[325px] md:h-[250px]">*/}
        {/*    <Image*/}
        {/*      src="/images/intro3.png"*/}
        {/*      className="rounded-xl"*/}
        {/*      fill*/}
        {/*      style={{ objectFit: "cover" }}*/}
        {/*      alt="logo"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </section>
  );
}
