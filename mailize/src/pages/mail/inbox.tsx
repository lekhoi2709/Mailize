import { useSession } from "next-auth/react"

import MailBox from ".";
import MailItem from "@/components/mail-item";

import axios from "axios";

//
export default function Inbox() {
   const { data: session } = useSession()

   // const emailData = await axios({
   //    url: `${process.env.DATABASE_URL}/api/mail/inbox`,
   //    method: "GET",
   //    headers: {
   //       "Authorization": `Bearer ${session?.user.accessToken}`
   //    },
   //    data: session?.user.email
   // })

   console.log(process.env.NEXT_PUBLIC_DATABASE_URL)

   return (
      <MailBox>
         <div className="w-full h-full rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
            {/* {emails.map((item) => {
               return (
                  <MailItem key={item._id} item={item} />
               )
            })} */}
         </div>
      </MailBox>
   );
}