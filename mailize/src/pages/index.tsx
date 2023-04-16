import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import { Dancing_Script, Lora } from "next/font/google";

const dancing = Dancing_Script({
  subsets: ["latin"],
});
const lora = Lora({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`${lora.className} flex min-h-screen flex-col max-w-screen overflow-x-hidden`}
    >
      <nav className="p-5 w-full h-[10%] bg-[#D4CACD] flex justify-center items-center md:justify-between z-20">
        <Link href="/">
          <h1 className={`${dancing.className} text-3xl text-[#BB2649]`}>
            Mailize
          </h1>
        </Link>

        <div className="gap-1 hidden md:flex items-center">
          <Link href="/login">
            <Button
              variant="contained"
              className={`${lora.className} bg-[#BB2649] hover:bg-[#6e162b] text-[12px]`}
            >
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outlined"
              className={`${lora.className} text-[#BF2E58] border-[#D4CACD] hover:border-[#6e162b] text-[12px]`}
            >
              Register
            </Button>
          </Link>
        </div>
      </nav>
      <div className="md:flex md:items-center md:justify-evenly">
        <div className="w-full md:w-[50%] h-[90%] z-10">
          <div className="p-10 w-full h-[50%] flex flex-col gap-8">
            <h1 className="text-3xl md:text-6xl">
              Welcome to<br></br>Mailize
            </h1>
            <p className="text-lg">
              A fast, secure way to send email <br></br>Brilliant app for people
              who want more
            </p>
            <div className="flex gap-1">
              <Link href="/login">
                <Button
                  variant="contained"
                  className={`${lora.className} bg-[#BB2649] hover:bg-[#6e162b] text-[12px] md:text-sm`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outlined"
                  className={`${lora.className} text-[#BF2E58] border-[#D4CACD] hover:border-[#6e162b] text-[12px] md:text-sm`}
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <picture className="w-fit h-[50%]">
          <Image
            src="/assets/Saly-10/Saly_10_870.webp"
            alt=""
            width={600}
            height={600}
            className="object-contain"
          />
        </picture>
      </div>
    </main>
  );
}
