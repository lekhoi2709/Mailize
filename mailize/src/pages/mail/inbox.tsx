import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@mui/material";

export default function Inbox() {
   const { data: session } = useSession()
   console.log({ session })



   return (
      <div>
         <p>Hello, {session?.user?.firstName} {session?.user?.lastName}</p>
         <Button onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>Log out</Button>
      </div>
   );
}