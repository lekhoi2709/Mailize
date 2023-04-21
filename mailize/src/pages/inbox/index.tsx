import { signIn, signOut, useSession } from "next-auth/react"

export default function Inbox() {
   const { data: session } = useSession()
   console.log({ session })

   return (
      <div>
         <p>This is inbox Page</p>
      </div>
   );
}