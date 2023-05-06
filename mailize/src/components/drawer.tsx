import {
   useState,
   Fragment,
   useEffect,
   useCallback,
   useRef
} from "react";

import {
   Box,
   SwipeableDrawer,
   IconButton,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Divider,
   Badge
} from "@mui/material"

import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { useRouter } from "next/router";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";

import { useSession } from "next-auth/react";

import axios from "axios";

//
const dancing = Dancing_Script({
   subsets: ["latin"],
});

export default function Drawer() {
   const [toggle, setToggle] = useState<boolean>(false)
   const [count, setCount] = useState<Number>(0)
   const router = useRouter()
   const { data: session } = useSession()

   const useInterval = (callback: () => void, delay: number) => {
      const timerRef = useRef<number>()
      const funcRef = useRef(callback)
      funcRef.current = callback

      useEffect(() => {
         timerRef.current = window.setInterval(() => {
            funcRef.current()
         }, delay < 0 ? 0 : delay)

         return () => {
            window.clearInterval(timerRef.current)
         }
      }, [delay])

      const clear = useCallback(() => {
         window.clearInterval(timerRef.current)
      }, [])

      return clear
   }
   const getCount = async () => {
      try {
         const data = await axios({
            url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/${session?.user.email}`,
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user.accessToken}`
            },
         })
         setCount(data?.data?.count)
      } catch (e) {
         console.log(e)
      }
   }

   useInterval(getCount, 5000)

   const toggleDrawer = (toggle: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
         event &&
         event.type === 'keydown' &&
         ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
      ) {
         return;
      }

      setToggle(toggle)
   }

   function iconList(index: number) {
      switch (index) {
         case 0:
            return (
               <Badge badgeContent={Number(count)} max={99} color="primary">
                  <InboxIcon />
               </Badge>
            )
         case 1:
            return <StarIcon />
         case 2:
            return <SendIcon />
         case 3:
            return <InsertDriveFileIcon />
         case 4:
            return <DeleteIcon />
      }
   }

   return (
      <div>
         <Fragment>
            <IconButton onClick={() => setToggle(!toggle)}>
               <MenuIcon />
            </IconButton>
            <SwipeableDrawer
               anchor="left"
               open={toggle}
               onOpen={toggleDrawer(true)}
               onClose={toggleDrawer(false)}>
               <Box
                  sx={{ width: 300 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                  className="bg-[#1b2a2d] md:bg-[#272727] h-full text-md">
                  <div>
                     <div className="w-fit h-fit md:hidden pl-4 py-4">
                        <Link href="/">
                           <h1 className={`${dancing.className} text-3xl text-[#e7e7e7]`}>Mailize</h1>
                        </Link>
                     </div>
                     <Divider />
                     <List>
                        {['Inbox', 'Starred', 'Sent', 'Draft', 'Trash'].map((text, index) => (
                           <ListItem key={text}>
                              <ListItemButton onClick={() => router.push(`/mail/${text.toLowerCase()}`)} className="gap-2 rounded-lg">
                                 <ListItemIcon className="text-[#e7e7e7]">
                                    {iconList(index)}
                                 </ListItemIcon>
                                 <ListItemText className="text-[#e7e7e7]" primaryTypographyProps={{ fontSize: 15 }}>{text}</ListItemText>
                              </ListItemButton>
                           </ListItem>
                        ))}
                     </List>
                  </div>
               </Box>
            </SwipeableDrawer>
         </Fragment>
      </div>
   );
}