import Fab from "@mui/material/Fab"
import EditIcon from "@mui/icons-material/Edit"

export default function Compose() {
   return (
      <Fab variant="extended" className="bg-[#244147] text-[#a1bbc0] rounded-xl flex items-center justify-center absolute bottom-6 right-6 normal-case hover:bg-[#3f686f]">
         <EditIcon className="mr-1" />
         <p>Compose</p>
      </Fab>
   )
}