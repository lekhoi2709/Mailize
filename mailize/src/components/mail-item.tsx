import Link from "next/link"
import { useRouter } from "next/router"

import { Avatar } from "@mui/material"

import moment from "moment"

interface MailItems {
   item: {
      _id: string,
      from: string,
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
   const mail = item.item
   const lastName = mail.from.split(' ')[0]

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
      date = moment(mail.createAt).format("MMM D, YY")
   }

   const readMail = async () => {

   }

   return (
      <Link href={router.asPath + `/${mail._id}`} onClick={readMail} className="outline-none flex items-center gap-4 text-sm relative w-full p-2 px-4 rounded-lg hover:bg-zinc-900 focus:bg-gray-900 md:bg-zinc-700 text-gray-500">
         <Avatar sx={{ width: 35, height: 35, fontSize: 15 }}>{avaLetter}</Avatar>
         <p className="absolute md:right-2 md:top-2 right-1 top-1">{date}</p>
         <div className="overflow-hidden">
            <h1 className="font-bold text-lg">{mail.from}</h1>
            <div>
               <p className="font-bold">{mail.content.title}</p>
               <p className="relative truncate">{mail.content.text}</p>
            </div>
         </div>
      </Link>
   )
}