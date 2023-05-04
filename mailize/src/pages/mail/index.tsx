import React, { ReactNode, useEffect } from "react"

import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react"

import Button from "@mui/material/Button";

import AppBar from "@/components/appbar";
import Unauthorized from "@/components/unauthorized";

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
         <Unauthorized />
      )
   } else {
      return (
         <main className="w-screen h-screen bg-[#121212] p-4 overflow-y-hidden flex flex-col justify-evenly">
            <AppBar />
            {page === 'Profile' ? <></> : <p className="mb-4 text-[#8a9698] text-sm md:hidden">{page}</p>}
            {children}
         </main>
      );
   }
}