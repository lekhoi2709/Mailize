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
         <div className="relative top-40 md:top-24 md:left-20 z-20">
            <div className="p-10 w-full flex flex-col gap-8">
               <h1 className="text-5xl text-center md:text-start md:text-[9rem]">
                  Mailize
               </h1>
               <p className="text-lg">
                  A fast, secure way to send email. <br></br>Brilliant app for people
                  who want more.
               </p>
               <div className="text-center md:text-start">
                  <Link href="/login">
                     <Button
                        variant="contained"
                        className={`${lora.className} p-3 text-[#e7e7e7] bg-[#2B4EFF] hover:bg-[#213ABF] text-md md:text-sm`}
                     >
                        Getting started
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
         <picture className="w-full h-screen absolute z-0">
            <Image
               src="/images/bg1.jpg"
               alt=""
               fill
               className="contain"
               priority
            />
         </picture>
      </main>
   );
}
