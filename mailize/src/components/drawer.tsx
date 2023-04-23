import {
   useState,
   Fragment,
   ReactNode,
   FunctionComponent
} from "react";

import Link from "next/link";

import {
   SwipeableDrawer,
   IconButton,
   Box,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Divider,
} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { useRouter } from "next/router";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({
   subsets: ["latin"],
});

export default function Drawer() {
   const [toggle, setToggle] = useState<boolean>(false)
   const router = useRouter()

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
            return <InboxIcon />
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
                  className="bg-[#152c31] md:bg-[#272727] h-full text-md">
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