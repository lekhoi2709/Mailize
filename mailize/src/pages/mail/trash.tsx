import { useState, useRef, useEffect, useCallback } from "react";

import { useSession } from "next-auth/react";

import axios from "axios";

import { CircularProgress } from "@mui/material"

import MailBox from ".";
import MailItem from "@/components/mail-item";


//
interface Email {
   _id: string,
   from: {
      email: string,
      name: string
   },
   to: {
      receiver: string[],
      cc: string[],
      bcc: string[],
      _id: string
   },
   content: {
      title: string,
      text: string,
      attachment: string[]
      _id: string
   },
   starred: boolean,
   trash: boolean,
   createAt: string,
   read: boolean,
   __v: number
}


export default function Inbox() {
   const { data: session } = useSession()
   const [email, setEmail] = useState<Email[]>([])

   const fetchApi = useCallback(async () => {
      const payload = {
         email: session?.user.email
      }
      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/get-trash`,
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
            data: payload
         })
         setEmail(data.data?.trash)
      } catch (e) {
         console.log(e)
      }
   }, [session?.user.email, session?.user.accessToken])

   useEffect(() => {
      fetchApi()
   }, [fetchApi])

   return (
      <MailBox>
         <div className={`w-full h-full z-0 relative rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden items-center`}>
            {email.length <= 0 ? <div>Empty</div> : <></>}
            {email ? email.map((item: any) => {
               return (
                  <MailItem key={item._id} item={item} />
               )
            }) : <></>}
         </div>
      </MailBox>
   );
}