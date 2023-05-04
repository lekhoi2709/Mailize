import { useState, useEffect, useRef } from "react"

import { useRouter } from "next/router"

import { useSession } from "next-auth/react"

import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Backdrop,
   CircularProgress
} from "@mui/material"

import ErrorIcon from "@mui/icons-material/Error"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import axios from "axios"

import MailBox from "."

//
export default function Profile() {
   const [open, setOpen] = useState<boolean>(false)
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()
   const [isLoading, setLoading] = useState<boolean>(false)

   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

   const { data: session } = useSession()

   const router = useRouter()

   useEffect(() => {
      clearTimeout(timerRef.current)
   }, [])

   const handleOpenDialog = () => {
      setOpen(true)
   }

   const handleCloseDialog = () => {
      setOpen(false)
   }

   const confirmDelete = async () => {
      setOpen(false)
      const email = session?.user.email
      const phone = session?.user.phone
      const payload = {
         email: email,
         phone: phone
      }

      setLoading(true)

      try {
         const data = await axios({
            url: "http://localhost:8080/api/auth/delete-account",
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
            data: payload
         })

         timerRef.current = setTimeout(() => {
            setLoading(false)
            if (data.status == 200) {
               setSuccess(data.data?.msg)
            } else {
               setSuccess(data.data?.msg)
            }
         }, 1500)


      } catch (err: any) {
         timerRef.current = setTimeout(() => {
            setLoading(false)
            if (err.response.data.msg) {
               setError(err.response.data.msg)
            } else {
               console.log(err)
            }
         }, 1500)
      }
   }

   const closeBackDrop = () => {
      setError(undefined)
   }

   const closeAndRedirectBackDrop = () => {
      setSuccess(undefined)
      router.push('/api/auth/signin')
   }

   return (
      <MailBox>
         <div className="w-full h-full rounded-lg md:p-5 md:flex md:flex-col md:gap-4 text-[#e7e7e7] md:items-center">
            <h1 className="text-xl hidden md:block">Account Settings</h1>
            <div className="w-full md:w-fit border border-zinc-800 rounded-lg p-5 px-8 flex flex-col gap-12">
               <h1>Personal Information</h1>
               <div className="flex justify-between md:gap-32">
                  <div className="flex flex-col gap-8 md:gap-12">
                     <div>
                        <span className="text-sm text-zinc-500">First Name</span>
                        <p>{session?.user.firstName}</p>
                     </div>
                     <div>
                        <span className="text-sm text-zinc-500">Email</span>
                        <p className="break-words w-[130px] md:w-full">{session?.user.email}</p>
                     </div>
                     <div>
                        <span className="text-sm text-zinc-500">Role</span>
                        <p>{session?.user.role}</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-8 md:gap-12">
                     <div>
                        <span className="text-sm text-zinc-500">Last Name</span>
                        <p>{session?.user.lastName}</p>
                     </div>
                     <div>
                        <span className="text-sm text-zinc-500">Phone</span>
                        <p>{session?.user.phone}</p>
                     </div>
                  </div>
               </div>
            </div>
            <Button
               variant="contained"
               color="primary"
               className="w-full md:w-[20%] mt-6 p-3 bg-[#066fff] text-[#e7e7e7]"
               onClick={() => router.push("/auth/change-pass")}>
               Change Password
            </Button>
            <Button
               variant="outlined"
               color="error"
               className="w-full md:w-[20%] mt-6 p-3 border border-red-600"
               onClick={handleOpenDialog}>
               {isLoading ? <CircularProgress color="error" size={"1.5rem"} /> : "Delete account"}
            </Button>
            <Dialog
               open={open}
               onClose={handleCloseDialog}
               aria-labelledby="alert-dialog-title"
               aria-describedby="alert-dialog-description">
               <DialogTitle>Delete Account</DialogTitle>
               <DialogContent>
                  <DialogContentText>Are you sure you want to delete your current account?</DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={handleCloseDialog} autoFocus>Cancel</Button>
                  <Button onClick={confirmDelete}>Yes</Button>
               </DialogActions>
            </Dialog>
            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={error != undefined}
               onClick={closeBackDrop}
               className="flex items-center justify-center"
            >
               <div className="h-fit w-fit px-6 py-16 bg-[#121212] font-bold text-rose-600 flex gap-3 items-center justify-center">
                  <ErrorIcon />
                  <p>{error}</p>
               </div>
            </Backdrop>
            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={success != undefined}
               onClick={closeAndRedirectBackDrop}
               className="flex flex-col items-center justify-center"
            >
               <div className="h-fit w-fit px-6 py-16 bg-[#121212] font-bold text-green-500 flex gap-3 items-center justify-center">
                  <CheckCircleIcon />
                  <p>{success}</p>
               </div>
            </Backdrop>
         </div>
      </MailBox>
   )
}