import { useSession } from "next-auth/react"

import MailBox from ".";

export default function Inbox() {
   const { data: session } = useSession()

   return (
      <MailBox>
         <main>
         </main>
      </MailBox>
   );
}