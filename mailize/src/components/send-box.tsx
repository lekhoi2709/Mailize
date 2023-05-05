import { useState } from "react";

import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { IconButton, TextField, InputAdornment } from "@mui/material"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import axios from "axios";

//
interface FormInput {
   email: string,
   receiver: string,
   cc: string,
   bcc: string,
   title: string,
   text: string
}

export default function SendBox() {
   const [drop, setDrop] = useState<boolean>(false)
   const router = useRouter()
   const { data: session } = useSession()

   const formSchema = Yup.object().shape({
      email: Yup.string().trim(),
      receiver: Yup.string().trim().required("Add at least one recipient"),
      cc: Yup.string().trim(),
      bcc: Yup.string().trim(),
      title: Yup.string().trim(),
      text: Yup.string().trim()
   }, [["cc", "bcc"], ["receiver", "bcc"], ["receiver", "cc"]])

   const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({ mode: "onTouched", resolver: yupResolver(formSchema) })

   const onSubmit: SubmitHandler<FormInput> = async (data) => {
      const receiver = data.receiver.split(',')
      const cc = data.cc?.split(',')
      const bcc = data.bcc?.split(',')

      const payload = {
         from: data.email,
         to: {
            receiver: receiver,
            cc: cc,
            bcc: bcc
         },
         content: {
            title: data.title,
            text: data.text
         }
      }

      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/sent`,
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
            data: payload
         })
         if (data.status == 200) {
            router.push(router.route)
         }
      } catch (e) {
         console.log(e)
      }
   };

   return (
      <div className="absolute bg-[#121212] w-full h-full py-4 px-2 md:w-[35%] md:h-[60%] md:top-[40%] md:right-10 top-0">
         <nav className="flex items-center justify-start mb-4">
            <div className="flex items-center gap-3">
               <IconButton onClick={() => router.push("/mail/inbox")}>
                  <ArrowBackIcon />
               </IconButton>
               <h1 className="text-xl">Compose</h1>
            </div>
         </nav>

         <form method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full border-b border-gray-600 p-2">
               <TextField
                  error={Boolean(errors.email)}
                  helperText={errors?.email?.message}
                  id="email"
                  className="w-full"
                  value={session?.user.email}
                  variant="standard"
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>From: </InputAdornment>,
                     readOnly: true,
                     disableUnderline: true
                  }}
                  {...register("email")}></TextField>
            </div>
            <div className="w-full border-b border-gray-600 p-2">
               <TextField
                  error={Boolean(errors.receiver)}
                  helperText={errors?.receiver?.message}
                  id="receiver"
                  className="w-full"
                  variant="standard"
                  autoFocus
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>To: </InputAdornment>,
                     endAdornment:
                        <InputAdornment position='end'>
                           <IconButton onClick={() => setDrop(!drop)}>
                              {drop ? <ArrowDropUpOutlinedIcon></ArrowDropUpOutlinedIcon> : <ArrowDropDownOutlinedIcon></ArrowDropDownOutlinedIcon>}
                           </IconButton>
                        </InputAdornment>,
                     disableUnderline: true
                  }}
                  {...register("receiver")}></TextField>
            </div>
            <div className={`w-full border-b border-gray-600 p-2 ${drop ? "" : "hidden"}`}>
               <TextField
                  error={Boolean(errors.cc)}
                  helperText={errors?.cc?.message}
                  id="cc"
                  className="w-full"
                  variant="standard"
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>Cc: </InputAdornment>,
                     disableUnderline: true
                  }}
                  {...register("cc")}></TextField>
            </div>
            <div className={`w-full border-b border-gray-600 p-2 ${drop ? "" : "hidden"}`}>
               <TextField
                  error={Boolean(errors.bcc)}
                  helperText={errors?.bcc?.message}
                  id="bcc"
                  className="w-full"
                  variant="standard"
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>Bcc: </InputAdornment>,
                     disableUnderline: true
                  }}
                  {...register("bcc")}></TextField>
            </div>
            <div className="w-full border-b border-gray-600 p-2">
               <TextField
                  error={Boolean(errors.title)}
                  helperText={errors?.title?.message}
                  id="title"
                  className="w-full"
                  variant="standard"
                  placeholder="Subject"
                  InputProps={{
                     disableUnderline: true
                  }}
                  {...register("title")}></TextField>
            </div>
            <div className="w-full p-2">
               <TextField
                  error={Boolean(errors.text)}
                  helperText={errors?.text?.message}
                  id="text"
                  className="w-full"
                  variant="standard"
                  multiline
                  placeholder="Compose Email"
                  InputProps={{
                     disableUnderline: true
                  }}
                  {...register("text")}></TextField>
            </div>
            <div className="absolute right-2 top-4">
               <IconButton type="submit"><SendOutlinedIcon /></IconButton>
            </div>
         </form>
      </div>
   )
}