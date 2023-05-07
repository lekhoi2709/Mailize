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

import DashboardIcon from '@mui/icons-material/Dashboard';
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
import Dashboard from "@/pages/admin";

//
const dancing = Dancing_Script({
   subsets: ["latin"],
});

export default function Drawer() {
   const [toggle, setToggle] = useState<boolean>(false)
   const [count, setCount] = useState<Number>(0)
   const router = useRouter()
   const { data: session } = useSession()

   const [loading, setLoading] = useState<boolean>(false)

   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

   const fetchApi = useCallback(async () => {
      try {
         if (session?.user.email !== undefined) {
            const data = await axios({
               url: `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/email/${session?.user.email}`,
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${session?.user.accessToken}`
               },
            })

            timerRef.current = setTimeout(() => {
               setCount(data?.data?.count)
               setLoading(false)
            }, 2000)
         }
      } catch (e) {
         console.log(e)
      }
   }, [session?.user.email, session?.user.accessToken])

   useEffect(() => {
      setLoading(true)
      fetchApi()
      clearTimeout(timerRef.current)
   }, [fetchApi])

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
      if (session?.user.role == "Admin") {
         switch (index) {
            case 0:
               return <DashboardIcon />
            case 1:
               return (
                  <Badge badgeContent={loading ? 0 : Number(count)} max={99} color="primary">
                     <InboxIcon />
                  </Badge>
               )
            case 2:
               return <StarIcon />
            case 3:
               return <SendIcon />
            case 4:
               return <InsertDriveFileIcon />
            case 5:
               return <DeleteIcon />
         }
      } else {
         switch (index) {
            case 0:
               return (
                  <Badge badgeContent={loading ? 0 : Number(count)} max={99} color="primary">
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
   }

   const handleRouting = (text: string) => {
      if (text == "Dashboard") {
         router.push('/admin')
      } else {
         router.push(`/mail/${text.toLowerCase()}`)
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
                        {session?.user.role == "Admin" ? ['Dashboard', 'Inbox', 'Starred', 'Sent', 'Draft', 'Trash'].map((text, index) => (
                           <ListItem key={text}>
                              <ListItemButton onClick={() => handleRouting(text)} className="gap-2 rounded-lg">
                                 <ListItemIcon className="text-[#e7e7e7]">
                                    {iconList(index)}
                                 </ListItemIcon>
                                 <ListItemText className="text-[#e7e7e7]" primaryTypographyProps={{ fontSize: 15 }}>{text}</ListItemText>
                              </ListItemButton>
                           </ListItem>
                        )) :
                           ['Inbox', 'Starred', 'Sent', 'Draft', 'Trash'].map((text, index) => (
                              <ListItem key={text}>
                                 <ListItemButton onClick={() => router.push(`/mail/${text.toLowerCase()}`)} className="gap-2 rounded-lg">
                                    <ListItemIcon className="text-[#e7e7e7]">
                                       {iconList(index)}
                                    </ListItemIcon>
                                    <ListItemText className="text-[#e7e7e7]" primaryTypographyProps={{ fontSize: 15 }}>{text}</ListItemText>
                                 </ListItemButton>
                              </ListItem>
                           ))
                        }

                     </List>
                  </div>
               </Box>
            </SwipeableDrawer>
         </Fragment>
      </div>
   );
}