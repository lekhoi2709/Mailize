import { useSession } from "next-auth/react"

import MailBox from ".";

export default function Inbox() {
   const { data: session } = useSession()

   return (
      <MailBox>
         <div className="w-full h-full rounded-lg border border-zinc-800">

         </div>
      </MailBox>
   );
}