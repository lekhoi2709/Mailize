import { useSession } from "next-auth/react"

import MailBox from ".";

export default function Inbox() {
   const { data: session } = useSession()

   return (
      <MailBox>
         <div className="w-full h-full rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden">

         </div>
      </MailBox>
   );
}