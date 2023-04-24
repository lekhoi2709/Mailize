import React, { ReactNode, useEffect } from "react"

import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react"

import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab"
import EditIcon from "@mui/icons-material/Edit"

import AppBar from "@/components/appbar";

interface Props {
   children: ReactNode
}

export default function MailBox({ children }: Props) {
   const router = useRouter()

   useEffect(() => {
      if (router.pathname == '/mail') {
         router.push("/mail/inbox")
      }
   }, [router])

   const path = router.route.split('/')[2]
   function Capitalize(path: string) {
      if (path) {
         return path[0]?.toUpperCase() + path.substring(1).toLowerCase()
      }
      return ''
   }
   const page = Capitalize(path)

   const { status } = useSession()
   if (status == "unauthenticated") {
      return (
         <main className="w-screen h-screen flex justify-center items-center">
            <div className="backdrop-blur-lg bg-[#e7e7e7]/10 p-16 flex flex-col items-center gap-10 rounded-lg">
               <div>
                  <h1 className="text-center text-red-500">401 Unauthenticate</h1>
                  <p>Please logging in to continue.</p>
               </div>
               <Link href="/api/auth/signin">
                  <Button variant="contained" className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7] ">Login Page</Button>
               </Link>
            </div>
         </main>
      )
   } else {
      return (
         <main className="w-screen h-screen bg-[#121212] p-4 overflow-y-hidden">
            <AppBar />
            <p className="my-4 text-[#8a9698] text-sm md:hidden">{page}</p>
            {children}
            <Fab variant="extended" className="bg-[#244147] text-[#a1bbc0] rounded-xl flex items-center justify-center absolute bottom-6 right-6 normal-case hover:bg-[#3f686f]">
               <EditIcon className="mr-1" />
               <p>Compose</p>
            </Fab>
         </main>
      );
   }
}