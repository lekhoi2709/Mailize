import { useEffect, useState, useCallback } from "react"

import Link from "next/link"
import { useRouter } from "next/router"

import { useSession } from "next-auth/react"

import { Avatar, IconButton } from "@mui/material"

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import moment from "moment"
import axios from "axios"

interface MailItems {
   item: {
      _id: string,
      from: {
         email: string,
         name: string
      },
      to: {
         receiver: string[]
      },
      content: {
         title: string,
         text: string
      }
      starred: boolean,
      trash: boolean,
      createAt: number,
      read: boolean
   }
}

export default function MailItem(item: MailItems) {
   const router = useRouter()
   const { data: session } = useSession()
   const mail = item.item
   const lastName = mail.from.name.split(' ')[0]
   const [star, setStar] = useState<boolean>(mail.starred)

   var avaLetter: string = ''

   function getLength(str: string | "") {
      return str.length
   }

   if (getLength(lastName ?? "") <= 2) {
      avaLetter = lastName.toUpperCase() || ''
   } else {
      avaLetter = lastName![0].toUpperCase()
   }

   const year = moment(mail.createAt).format("YY")
   const now = moment(Date.now()).format("YY")
   var date = ""

   if (year == now) {
      date = moment(mail.createAt).format("MMM D")
   }
   else {
      date = moment(mail.createAt).format("D/MM/YY")
   }

   const handleStarred = useCallback(async (star: boolean) => {
      const payload = {
         id: mail._id,
         starred: star
      }

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/star`,
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
            data: payload
         })

      } catch (e) {
         console.log(e)
      }
   }, [mail._id, session?.user.accessToken])

   useEffect(() => {
      handleStarred(star)
   }, [star, handleStarred])

   const readMail = async () => {
      const payload = {
         id: mail._id
      }

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/inbox`,
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
            data: payload
         })
         if (data.status == 200) {
            router.push(router.asPath + '/' + mail._id)
         }
      } catch (e) {
         console.log(e)
      }
   }

   const data = JSON.parse(mail.content.text.toString())

   return (
      <div className="w-full relative">
         <div onClick={readMail} className={`backdrop-blur-lg outline-none flex items-center gap-4 text-sm w-full p-2 px-4 rounded-lg hover:bg-zinc-900 focus:bg-gray-900 h-[86px] ${mail.read ? "md:bg-zinc-700/20 text-gray-500" : "md:bg-zinc-600/20 text-[#e7e7e7]"} cursor-pointer`}>
            <Avatar sx={{ width: 35, height: 35, fontSize: 15 }}>{avaLetter}</Avatar>
            <p className="absolute right-2 top-2">{date}</p>
            <div className="overflow-hidden">
               <h1 className={`text-lg ${mail.read ? "" : "font-bold"}`}>{mail.from.name}</h1>
               <div>
                  <p className={`${mail.read ? "" : "font-bold"}`}>{mail.content.title}</p>
                  <p className="relative truncate">{data.root.children[0].children[0].text}</p>
               </div>
            </div>
         </div>
         <div className="absolute z-20 bottom-2 right-2">
            <IconButton onClick={() => setStar(!star)}>
               {star ?
                  <StarIcon className={`${mail.read ? "text-yellow-600" : "text-yellow-500"}`}></StarIcon> :
                  <StarBorderIcon className={`${mail.read ? "text-gray-500" : "text-[#e7e7e7]"}`}></StarBorderIcon>}
            </IconButton>
         </div>
      </div>
   )
}