import { signOut, useSession } from "next-auth/react"
import { Button } from "@mui/material";

import MailBox from ".";

export default function Inbox() {
   const { data: session } = useSession()
   return (
      <MailBox>
         <div>
            <p>Hello, {session?.user?.firstName} {session?.user?.lastName}</p>
            <Button onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>Log out</Button>
         </div>
      </MailBox>
   );
}