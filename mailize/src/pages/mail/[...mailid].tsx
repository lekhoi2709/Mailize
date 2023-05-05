import { useRouter } from "next/router"

import MailBox from "."

export default function MailDetails() {
   const router = useRouter()
   const { mailid } = router.query
   console.log(mailid)
   return (
      <MailBox>
         <div className="w-full h-full rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden">

         </div>
      </MailBox>
   )
}