import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import { Lora } from "next/font/google";

import Navbar from "@/components/navbar";

const lora = Lora({ subsets: ["latin"] });

export default function Home() {
   return (
      <main
         className={`${lora.className} flex min-h-screen flex-col max-w-screen overflow-x-hidden`}
      >
         <Navbar />
         <div className="relative w-screen h-screen">
            <picture className="w-full h-screen absolute z-0">
               <Image
                  src="/images/bg2.jpg"
                  alt=""
                  fill
                  className="contain"
                  priority
               />
            </picture>
            <section className="backdrop-blur-lg bg-[#121212]/30 w-full h-full">
               <div className=" flex flex-col gap-8 z-10 md:p-10 top-[20%] md:top-[12%] absolute">
                  <h1 className="text-5xl text-center md:text-start md:text-[6rem] leading-normal">
                     Experience Fast and Reliable Email Service
                  </h1>
                  <p className="text-lg text-center md:text-start">
                     Welcome to our web mail service. <br></br>
                     Where you can have the freedom to communicate with anyone, anywhere in the world.<br></br>
                     Sign up now and start sending emails in seconds.
                  </p>
                  <div className="text-center md:text-start">
                     <Link href="/auth/register">
                        <Button
                           variant="contained"
                           className={`${lora.className} p-3 text-[#e7e7e7] bg-[#2B4EFF] hover:bg-[#213ABF] text-md md:text-sm`}
                        >
                           Getting started
                        </Button>
                     </Link>
                  </div>
               </div>
            </section>
         </div>
         <div className="w-screen h-screen relative">
            <picture className="w-full h-full absolute z-0">
               <Image
                  src="/images/bg3.jpg"
                  alt=""
                  fill
                  className="contain"
                  priority
               />
            </picture>
            <section className="w-full h-full backdrop-blur-lg bg-[#121212]/30">

            </section>
         </div>
      </main>
   );
}
