import {
   Button,
   Avatar,
   Grow,
   Box,
   CardHeader,
   IconButton,
   Menu
} from "@mui/material"

import LogoutIcon from '@mui/icons-material/Logout';

import { signOut } from 'next-auth/react'

import { useRouter } from "next/router";

interface Props {
   display: boolean,
   lastName: string | undefined,
   firstName: string | undefined,
   email: string | undefined,
   avaLetter: string
}

export default function Dropdown({ display, lastName, firstName, email, avaLetter }: Props) {
   const router = useRouter()

   return (
      <Grow in={display}>
         <div className="absolute z-20 top-[86px] left-[calc(3%)] w-[94%] rounded-lg bg-[#1b2a2d] p-2 pt-6 md:w-fit md:left-auto md:right-16 md:bg-[#272727] md:top-24">
            <Box className="bg-[#121212] w-full md:w-fit p-8 rounded-lg ">
               <CardHeader
                  avatar={<IconButton onClick={() => router.push("/mail/profile")}><Avatar sx={{ width: 45, height: 45, fontSize: 20 }}>{avaLetter}</Avatar></IconButton>}
                  title={`${firstName} ${lastName}`}
                  subheader={email}
                  className="pl-0">
               </CardHeader>
               <Button
                  className="flex gap-4 leading-snug text-center focus:bg-blue-300 focus:text-black rounded-lg"
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>
                  <LogoutIcon />
                  <p>Log out</p>
               </Button>
            </Box>
         </div>
      </Grow>
   );
}