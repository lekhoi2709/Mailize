import { useState } from "react";
import { signOut, useSession } from "next-auth/react"
import { Button, Avatar, IconButton } from "@mui/material";

import MailBox from ".";
import Dropdown from "@/components/dropdown";

export default function Inbox() {
   const [display, setDisplay] = useState<boolean>(false)

   const { data: session } = useSession()

   const firstName = session?.user.firstName
   const lastName = session?.user.lastName
   const email = session?.user.email

   return (
      <MailBox>
         <nav className="flex w-full text-white items-center justify-between p-3">
            <p>Hello, {firstName} {lastName}</p>
            <IconButton
               onClick={() => {
                  setDisplay(!display)
               }}
               className="w-fit h-fit">
               <Avatar sx={{ width: 30, height: 30, fontSize: 15 }}>{session?.user?.lastName}</Avatar>
            </IconButton>
            <Dropdown
               display={display}
               lastName={lastName}
               firstName={firstName}
               email={email}
            />
         </nav>
      </MailBox>
   );
}