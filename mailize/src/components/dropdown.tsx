import { Button, Avatar, Grow, Box, CardHeader } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react'

interface Props {
   display: boolean,
   lastName: string | undefined,
   firstName: string | undefined,
   email: string | undefined,
   avaLetter: string
}

export default function Dropdown({ display, lastName, firstName, email, avaLetter }: Props) {
   return (
      <Grow in={display}>
         <div className="fixed z-40 top-[90px] left-0 w-full rounded-lg bg-[#152c31] md:bg-[#272727] p-2 pt-6 md:left-auto md:right-14 md:top-14 md:w-fit ">
            <Box className="bg-[#121212] w-full md:w-fit p-8 rounded-lg ">
               <CardHeader
                  avatar={<Avatar sx={{ width: 45, height: 45, fontSize: 20 }}>{avaLetter}</Avatar>}
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