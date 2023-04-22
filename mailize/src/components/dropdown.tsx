import { Button, Avatar, Grow, Box, CardHeader } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react'

interface Props {
   display: boolean,
   lastName: string | undefined,
   firstName: string | undefined,
   email: string | undefined
}

export default function Dropdown({ display, lastName, firstName, email }: Props) {
   return (
      <Grow in={display}>
         <div className="fixed md:right-14 top-14 rounded-lg bg-gray-800 p-2">
            <Box className="bg-[#121212] w-fit p-10 rounded-lg ">
               <CardHeader
                  avatar={<Avatar>{lastName}</Avatar>}
                  title={`${firstName} ${lastName}`}
                  subheader={email}>

               </CardHeader>
               <Button
                  className="flex gap-4 leading-snug text-center"
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>
                  <LogoutIcon />
                  <p>Log out</p>
               </Button>
            </Box>
         </div>
      </Grow>
   );
}