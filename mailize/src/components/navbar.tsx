import Link from "next/link";
import Button from "@mui/material/Button";
import { Dancing_Script, Lora } from "next/font/google";

const dancing = Dancing_Script({
   subsets: ["latin"],
});

const lora = Lora({ subsets: ["latin"] });

export default function Navbar() {
   return (
      <nav className="p-5 w-full h-[10%] bg-[#100f10] flex justify-center items-center md:justify-between z-20">
         <Link href="/">
            <h1 className={`${dancing.className} text-3xl text-[#e7e7e7]`}>
               Mailize
            </h1>
         </Link>

         <div className="gap-1 hidden md:flex items-center">
            <Link href="/login">
               <Button
                  variant="contained"
                  className={`${lora.className} text-[#e7e7e7] bg-[#2B4EFF] hover:bg-[#213ABF] text-[12px]`}
               >
                  Try Free
               </Button>
            </Link>
         </div>
      </nav>
   )
}