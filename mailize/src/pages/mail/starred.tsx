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
   const [loading, setLoading] = useState<boolean>(false)

   const useInterval = (callback: () => void, delay: number) => {
      const timerRef = useRef<number>()
      const funcRef = useRef(callback)
      funcRef.current = callback

      useEffect(() => {
         timerRef.current = window.setInterval(() => {
            funcRef.current()
            setLoading(true)
         }, delay < 0 ? 0 : delay)

         return () => {
            window.clearInterval(timerRef.current)
            setLoading(false)
         }
      }, [delay])

      const clear = useCallback(() => {
         window.clearInterval(timerRef.current)
         setLoading(false)
      }, [])

      return clear
   }
   const getEmail = async () => {

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/starred/${session?.user.email}`,
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
         })
         setEmail(data.data?.inbox)
      } catch (e) {
         console.log(e)
      }
   }

   useInterval(getEmail, 2000)

   return (
      <MailBox>
         <div className={`w-full h-full z-0 relative rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden items-center ${loading ? "justify-start" : "justify-center"}`}>
            {loading ? email.length <= 0 ? <div>Empty</div> : <></> : <CircularProgress />}
            {email ? email.map((item: any) => {
               return (
                  <MailItem key={item._id} item={item} />
               )
            }) : <></>}
         </div>
      </MailBox>
   );
}