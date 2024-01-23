import Image from "next/image";
import React from "react";

export default function Hero() {
  let tokenAddress = "0x7B8d77E6D20f8Fd22B7F2aA66C0dE68FEBf3c987";
  // tokenAddress = tokenAddress.slice(0, 5) + "..." + tokenAddress.slice(-5);
  console.log(tokenAddress);

  return (
    // <section className="bg-black py-24 mt-0">
    <section className="pt-12 pb-24 mt-0">
      <Image
        src="/images/hero.svg"
        className="mx-auto"
        width={700}
        height={500}
        alt="logo"
      />
      <div className="text-[50px] leading-[50px] sm:text-[70px] text-center mb-6 font-black">
        Tura Inscription
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="bg-white shadow-2xl p-3 flex flex-col text-center place-content-center rounded-xl text-black w-[250px] h-[100px]">
          <div className="text-md font-bold"> Name</div>
          <div className="text-2xl"> TuraInscription</div>
        </div>
        <div className="bg-white shadow-2xl p-3 flex flex-col text-center place-content-center rounded-xl text-black w-[250px] h-[100px]">
          <div className="text-md font-bold"> Symbol</div>
          <div className="text-2xl"> TUI</div>
        </div>
        <div className="bg-white shadow-2xl p-3 flex flex-col text-center place-content-center rounded-xl text-black w-[250px] h-[100px]">
          <div className="text-md font-bold"> JSON</div>
            <div className="text-[16px] break-all"> JSON </div>
        </div>
        {/* <div className="bg-white p-3 flex flex-col text-center place-content-center rounded-xl text-black w-[250px] h-[100px]">
          <div className="text-md font-bold"> Logo</div>
          <Image
            src="/images/logoo.png"
            className="mx-auto"
            width={50}
            height={50}
            alt="logo"
          />
        </div> */}
      </div>
    </section>
  );
}
