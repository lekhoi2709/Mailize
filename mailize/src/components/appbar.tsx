import { useState } from "react";
import Link from 'next/link';

import { useSession } from "next-auth/react"

import { Avatar, IconButton } from "@mui/material";

import { Dancing_Script } from "next/font/google";

import Dropdown from "@/components/dropdown";
import Drawer from "@/components/drawer";
import SearchBar from "@/components/searchbar";

const dancing = Dancing_Script({
   subsets: ["latin"],
});

export default function AppBar() {
   const [display, setDisplay] = useState<boolean>(false)

   const { data: session } = useSession()

   const firstName = session?.user.firstName
   const lastName = session?.user.lastName
   const email = session?.user.email

   var avaLetter: string = ''

   function getLength(str: string | "") {
      return str.length
   }

   if (getLength(lastName ?? "") <= 2) {
      avaLetter = lastName || ''
   } else {
      avaLetter = lastName![0]
   }

   return (
      <nav className="flex w-full p-1 gap-2 text-white items-center md:justify-between bg-[#1b2a2d] rounded-full md:bg-[#121212]">
         <div className="flex items-center gap-3 h-fit">
            <Drawer />
            <div className="w-fit h-fit hidden md:block">
               <Link href="/">
                  <h1 className={`${dancing.className} text-3xl text-[#e7e7e7]`}>Mailize</h1>
               </Link>
            </div>
         </div>
         <SearchBar />
         <div>
            <IconButton
               onClick={() => {
                  setDisplay(!display)
               }}
               className="w-fit h-fit">
               <Avatar sx={{ width: 30, height: 30, fontSize: 15 }}>{avaLetter}</Avatar>
            </IconButton>
            <Dropdown
               display={display}
               lastName={lastName}
               firstName={firstName}
               email={email}
               avaLetter={avaLetter}
            />
         </div>
      </nav>
   );
}