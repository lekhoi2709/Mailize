import {
   useState,
   useEffect,
   useCallback,
   useRef,
} from "react";

import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@mui/material";

import axios from "axios";

import AppBar from "@/components/appbar";

import { CircularProgress } from "@mui/material";

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
   __v: number
}

export default function Dashboard() {
   const { data: session } = useSession()
   const [data, setData] = useState<Email[]>([])
   const [loading, setLoading] = useState<boolean>(false)
   const router = useRouter()

   const useInterval = (callback: () => void, delay: number) => {
      const timerRef = useRef<number>()
      const funcRef = useRef(callback)
      funcRef.current = callback

      useEffect(() => {
         timerRef.current = window.setInterval(() => {
            setLoading(false)
            funcRef.current()
         }, delay < 0 ? 0 : delay)

         return () => {
            window.clearInterval(timerRef.current)
            setLoading(true)
         }
      }, [delay])

      const clear = useCallback(() => {
         window.clearInterval(timerRef.current)
         setLoading(true)
      }, [])

      return clear
   }

   const getCount = async () => {
      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/admin/${session?.user.email}`,
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
         })
         if (data.status == 200) {
            setData(data.data.data)
         }
      } catch (e) {
         console.log(e)
      }
   }

   useInterval(getCount, 5000)

   if (session?.user.role == "Admin") {
      return (
         <div className="w-screen h-screen">
            <picture className="w-full h-screen absolute z-0">
               <Image
                  src="/images/bg1.jpg"
                  alt=""
                  fill
                  className="contain"
                  priority
               />
            </picture>
            <main className="w-full h-full backdrop-blur-lg bg-[#121212]/70 p-4 overflow-x-hidden overflow-y-hidden flex flex-col justify-evenly">
               <AppBar />
               <div className={`w-full h-full z-0 relative rounded-lg flex flex-col gap-3 overflow-y-auto overflow-x-hidden items-center ${loading ? "justify-center" : "justify-start"}`}>
                  {loading ? <CircularProgress /> :
                     <div className="h-full flex flex-col gap-4 overflow-y-auto relative">
                        <p className="text-gray-500">All emails</p>
                        <p>Total: {data.length}</p>
                        {data.map(item => (
                           <div key={item._id} className="w-full border border-white p-2 rounded-lg flex flex-col gap-2">
                              <div className="flex gap-4">
                                 <p className="text-gray-400">From: </p>
                                 <p className="text-[#e7e7e7]">
                                    {item.from.email}
                                 </p>
                              </div>
                              <div className="flex gap-4">
                                 <p className="text-gray-400">To: </p>
                                 <p className="text-[#e7e7e7]">
                                    {item.to.receiver}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  }
               </div>
            </main>
         </div>
      )
   } else {
      return (
         <main className="w-screen h-screen flex justify-center items-center">
            <div className="backdrop-blur-lg bg-[#e7e7e7]/10 p-16 flex flex-col items-center gap-10 rounded-lg">
               <div>
                  <h1 className="text-center text-red-500">403 Unauthorized</h1>
                  <p>Please login as admin to continue.</p>
               </div>
               <Link href="/api/auth/signin">
                  <Button variant="contained" className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7] ">Login Page</Button>
               </Link>
            </div>
         </main>
      )
   }
}