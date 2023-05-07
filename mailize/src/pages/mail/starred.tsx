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


export default function Starred() {
   const { data: session } = useSession()
   const [email, setEmail] = useState<Email[]>([])
   const [loading, setLoading] = useState<boolean>(false)

   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

   const fetchApi = useCallback(async () => {
      try {
         if (session?.user.email !== undefined) {
            const data = await axios({
               url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/starred/${session?.user.email}`,
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${session?.user.accessToken}`
               },
            })

            timerRef.current = setTimeout(() => {
               setEmail(data.data.starred)
               setLoading(false)
            }, 2000)
         }
      } catch (e) {
         console.log(e)
      }
   }, [session?.user.email, session?.user.accessToken])

   useEffect(() => {
      setLoading(true)
      fetchApi()
      clearTimeout(timerRef.current)
   }, [fetchApi])

   return (
      <MailBox>
         <div className={`w-full h-full z-0 relative rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden items-center ${loading ? "justify-center" : "justify-start"}`}>
            {loading ? <CircularProgress /> : email.length <= 0 ? <p>Empty</p> : <></>}
            {email && !loading ? email.map((item: any) => {
               return (
                  <MailItem key={item._id} item={item} />
               )
            }) : <></>}
         </div>
      </MailBox>
   );
}