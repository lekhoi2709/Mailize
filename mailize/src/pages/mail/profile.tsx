import { useRouter } from "next/router"

import { useSession } from "next-auth/react"

import { Button } from "@mui/material"

import MailBox from "."

export default function Profile() {
   const { data: session } = useSession()

   const router = useRouter()

   return (
      <MailBox>
         <div className="w-full h-full rounded-lg md:p-5 md:flex md:flex-col md:gap-4 text-[#e7e7e7]">
            <h1 className="text-xl hidden md:block">Account Settings</h1>
            <div className="w-full md:w-fit border border-zinc-800 rounded-lg p-5 px-8 flex flex-col gap-12">
               <h1>Personal Information</h1>
               <div className="flex gap-8 md:gap-32">
                  <div className="flex flex-col gap-8 md:gap-12">
                     <div>
                        <span className="text-sm text-zinc-500">First Name</span>
                        <p>{session?.user.firstName}</p>
                     </div>
                     <div>
                        <span className="text-sm text-zinc-500">Email</span>
                        <p>{session?.user.email}</p>
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
                        <span className="text-sm text-zinc-500">Phone Number</span>
                        <p>{session?.user.phone}</p>
                     </div>
                  </div>
               </div>
            </div>
            <Button
               variant="contained"
               color="primary"
               className="w-full mt-6 p-3 bg-[#066fff] text-[#e7e7e7]"
               onClick={() => router.push("/auth/change-pass")}>
               Change Password
            </Button>
            <Button variant="outlined" color="error" className="w-full mt-6 p-3 border border-red-600">Delete Account</Button>
         </div>
      </MailBox>
   )
}