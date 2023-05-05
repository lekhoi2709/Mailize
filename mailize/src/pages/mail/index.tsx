import React, { ReactNode, useEffect } from "react"

import Image from "next/image";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react"

import AppBar from "@/components/appbar";
import Unauthorized from "@/components/unauthorized";
import ComposeSection from "@/components/compose-section";

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

   function Capitalize(path: string) {
      if (path) {
         return path[0]?.toUpperCase() + path.substring(1).toLowerCase()
      }
      return ''
   }

   var page = ""

   if (!router.query.mailid) {
      const path = router.route.split('/')[2]
      page = Capitalize(path)
   } else {
      const { mailid } = router.query
      page = mailid![1]
   }


   const { status } = useSession()
   if (status == "unauthenticated") {
      return (
         <Unauthorized />
      )
   } else {
      return (
         <div className="w-screen h-screen">
            <picture className="w-full h-screen absolute z-0">
               <Image
                  src="/images/bg1.jpg"
                  alt=""
                  fill
                  className="contain"
                  priority
               />
            </picture>
            <main className="w-full h-full backdrop-blur-lg bg-[#121212]/70 p-4 overflow-x-hidden overflow-y-hidden flex flex-col justify-evenly">
               <AppBar />
               {page === 'Profile' ? <></> : <p className="mb-4 text-white text-sm md:text-lg">{page}</p>}
               {children}
            </main>
            <ComposeSection />
         </div>
      );
   }
}