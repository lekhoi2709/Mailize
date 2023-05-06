import { useCallback, useEffect, useState, useRef } from "react"

import { useSession } from "next-auth/react"

import { useRouter } from "next/router"
import Image from "next/image"

import {
   IconButton,
   Avatar,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Button,
   CircularProgress
} from "@mui/material"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';

import axios from "axios"

import moment from "moment"
import { CLEAR_HISTORY_COMMAND } from "lexical"
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';


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
   reply: {
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
         text: string,
      }
   }
   starred: boolean,
   trash: boolean,
   read: boolean,
   createAt: string,
   __v: number
}

export default function MailDetails() {
   const router = useRouter()
   const { data: session } = useSession()
   const { mailid } = router.query
   const [email, setEmail] = useState<Email>()
   const [star, setStar] = useState<boolean>(false)
   const [open, setOpen] = useState<boolean>(false)
   const [restore, setRestore] = useState<boolean>(false)
   const [data, setData] = useState<string>("{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":3,\"mode\":\"normal\",\"style\":\"\",\"text\":\"\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}")

   const id = mailid![1] ?? ""
   const path = router.asPath.split('/')
   const time = moment(email?.createAt).format("hh:mm")
   const lastName = email?.from?.name?.split(' ')[0] ?? ""
   var avaLetter: string = ''

   const confirmDelete = async () => {
      setOpen(false)
      const payload = {
         id: id,
      }

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/trash`,
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
      router.push(`/mail/${path[2]}`)
   }

   const confirmRestore = async () => {
      setOpen(false)
      const payload = {
         id: id,
      }

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/restore`,
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
      router.push(`/mail/${path[2]}`)
   }

   const fetchApi = useCallback(async () => {
      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/id/${id}`,
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
         })
         setEmail(data.data.email[0])
      } catch (e) {
         console.log(e)
      }
   }, [id, session?.user.accessToken])

   useEffect(() => {
      fetchApi()
   }, [fetchApi])

   useEffect(() => {
      setStar(email?.starred ?? false)
   }, [email?.starred])

   function getLength(str: string | "") {
      return str.length
   }

   if (getLength(lastName ?? "") <= 2) {
      avaLetter = lastName!.toUpperCase() || ''
   } else {
      avaLetter = lastName!.toUpperCase()[0]
   }

   //Lexical Editor
   const theme = {}

   function onError(error: Error) {
      console.error(error);
   }

   const UpdatePlugin = (): void => {
      const [editor] = useLexicalComposerContext()

      useEffect(() => {
         if (email?.content.text !== undefined) {
            const editorState = editor.parseEditorState(email.content.text)
            editor.setEditorState(editorState)
            editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
         }
      }, [editor])

   }

   const initialConfig = {
      editable: false,
      theme,
      onError
   }

   return (
      <div className="w-screen h-screen text-[#e7e7e7]">
         <picture className="w-full h-screen absolute z-0">
            <Image
               src="/images/bg1.jpg"
               alt=""
               fill
               className="contain"
               priority
            />
         </picture>

         <div className={`w-full h-full backdrop-blur-lg bg-[#121212]/70 overflow-x-hidden overflow-y-hidden`}>
            <nav className={`flex items-center justify-between mb-4 bg-[#121212] w-full p-2`}>
               <IconButton onClick={() => router.push(`/mail/${path[2]}`)}>
                  <ArrowBackIcon />
               </IconButton>
               <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[40px] flex items-center justify-center">
                     {star ?
                        <StarIcon className="text-yellow-600"></StarIcon> :
                        <StarBorderIcon className="text-gray-500"></StarBorderIcon>}
                  </div>
                  {email?.trash ?
                     <IconButton onClick={() => setRestore(true)} >
                        <RestoreIcon className="text-gray-500"></RestoreIcon>
                     </IconButton> :
                     <IconButton onClick={() => setOpen(true)}>
                        <DeleteOutlineOutlinedIcon className="text-gray-500" />
                     </IconButton>}
                  <IconButton>
                     <MoreVertIcon className="text-gray-500" />
                  </IconButton>
               </div>
            </nav>
            <div className="md:p-14 md:h-[90%] rounded-lg">
               <div className="md:bg-[#272727] p-4 md:py-8 md:h-full rounded-lg">
                  <div className="p-2 px-4 w-full mb-4 md:px-8 md:mb-8">
                     <h1 className="text-xl break-words">{email?.content.title}</h1>
                  </div>
                  <section className="p-2 px-4 w-full flex items-center justify-between mb-4 md:px-12">
                     <div className="flex gap-4 items-center">
                        <Avatar sx={{ fontSize: 18 }}>{avaLetter}</Avatar>
                        <div className="flex flex-col">
                           <div className="flex gap-2 items-center">
                              <h1>{email?.from.name}</h1>
                              <p className="text-sm text-gray-400">{time}</p>
                           </div>
                           <p className="text-sm text-gray-500">
                              to {email?.to.receiver == session?.user.email ? "me" : email?.to.receiver}
                           </p>
                        </div>
                     </div>
                     <IconButton className="text-gray-500">
                        <ReplyIcon />
                     </IconButton>
                  </section>
                  <section className="p-4 md:px-12">
                     <LexicalComposer initialConfig={initialConfig}>
                        <RichTextPlugin
                           contentEditable={<ContentEditable className='outline-none focus:border focus:border-[#e7e7e7]' />}
                           placeholder={<div></div>}
                           ErrorBoundary={LexicalErrorBoundary}
                        />
                        <UpdatePlugin />
                     </LexicalComposer>
                  </section>
               </div>
            </div>
         </div>
         <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle sx={{ fontSize: 18 }}>Move to trash</DialogTitle>
            <DialogContent>
               <DialogContentText sx={{ fontSize: 15 }}>Are you sure you want to move this mail to trash?</DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpen(false)} variant="outlined" autoFocus sx={{ fontSize: 15 }}>Cancel</Button>
               <Button onClick={confirmDelete} variant="contained" className="bg-blue-400" sx={{ fontSize: 15 }}>Yes</Button>
            </DialogActions>
         </Dialog>
         <Dialog
            open={restore}
            onClose={() => setRestore(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle sx={{ fontSize: 18 }}>Restore</DialogTitle>
            <DialogContent>
               <DialogContentText sx={{ fontSize: 15 }}>Are you sure you want to restore this mail?</DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setRestore(false)} variant="outlined" autoFocus sx={{ fontSize: 15 }}>Cancel</Button>
               <Button onClick={confirmRestore} variant="contained" className="bg-blue-400" sx={{ fontSize: 15 }}>Yes</Button>
            </DialogActions>
         </Dialog>
      </div>
   )
}