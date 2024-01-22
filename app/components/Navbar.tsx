import Image from "next/image";
import React from "react";
import { Twitter } from "lucide-react";
import { BarChart4 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="container px-4 mt-2 mx-auto flex items-center bg-white h-20">
      <div className="flex flex-wrap sm:flex-nowrap items-center w-full justify-center gap-x-6 sm:justify-between">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.png" width={80} height={80} alt="logo" />
          <div className="text-4xl font-bold text-black">TuraInscription</div>
        </div>
        <div className="flex items-center gap-x-2">
          <Link target="_about" href="https://twitter.com/BoxingTokenEth">
            <Image
              src="/icons/twitter.svg"
              width={35}
              height={35}
              alt="BoxingToken's Twitter"
            />
          </Link>
          <Link target="_about" href="https://t.me/boxingtoken">
            <Image
              src="/icons/telegram.svg"
              width={35}
              height={35}
              alt="BoxingToken's Telegram"
            />
          </Link>
          <Link target="_about" href="https://discord.gg/jCSMFKBTzr">
            <Image
              src="/icons/discord.svg"
              width={35}
              height={35}
              alt="BoxingToken's Discord"
            />
          </Link>
          <Link
            target="_about"
            href="https://www.dextools.io/app/cn/ether/pair-explorer/0xb5e3e6d5d69f2b5dea4cba3f9650aac9af3459ab"
          >
            <Image
              src="/icons/chart.svg"
              width={35}
              height={35}
              alt="BoxingToken in Dextools"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
