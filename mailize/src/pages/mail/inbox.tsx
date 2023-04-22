import { useState } from "react";

import { useSession } from "next-auth/react"

import MailBox from ".";
import AppBar from "@/components/appbar";

export default function Inbox() {
   const { data: session } = useSession()

   return (
      <MailBox>
         <main className="w-full h-full p-4">
            <AppBar />
         </main>
      </MailBox>
   );
}