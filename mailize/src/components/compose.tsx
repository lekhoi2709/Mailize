import Fab from "@mui/material/Fab"
import EditIcon from "@mui/icons-material/Edit"

import { useRouter } from "next/router"

export default function Compose() {
   const router = useRouter()
   var isCompose = router.asPath.split("?")[1] == "compose"

   return (
      <Fab
         variant="extended"
         className={`bg-[#244147] text-[#a1bbc0] rounded-xl flex items-center justify-center absolute bottom-6 right-6 normal-case hover:bg-[#3f686f] ${isCompose ? "hidden" : ""}`}
         onClick={() => router.push("?compose")}>
         <EditIcon className="mr-1" />
         <p>Compose</p>
      </Fab>
   )
}