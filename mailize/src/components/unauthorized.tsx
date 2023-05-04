import Link from "next/link"
import { Button } from "@mui/material"

export default function Unauthorized() {
   return (
      <main className="w-screen h-screen flex justify-center items-center">
         <div className="backdrop-blur-lg bg-[#e7e7e7]/10 p-16 flex flex-col items-center gap-10 rounded-lg">
            <div>
               <h1 className="text-center text-red-500">401 Unauthenticate</h1>
               <p>Please logging in to continue.</p>
            </div>
            <Link href="/api/auth/signin">
               <Button variant="contained" className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7] ">Login Page</Button>
            </Link>
         </div>
      </main>
   )
}