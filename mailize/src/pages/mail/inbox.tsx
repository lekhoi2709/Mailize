import { signOut, useSession } from "next-auth/react"
import { Button } from "@mui/material";

export default function Inbox() {
   const { data: session, status } = useSession()
   console.log({ session })
   console.log(status)
   return (
      <div>
         <p>Hello, {session?.user?.firstName} {session?.user?.lastName}</p>
         <Button onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>Log out</Button>
      </div>
   );
}