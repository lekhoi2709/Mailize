import { useRouter } from "next/router"
import Compose from "./compose"
import SendBox from "./send-box"

export default function ComposeSection() {
   const router = useRouter()

   var isCompose = router.asPath.split("?")[1] == "compose"

   return (
      <div>
         <Compose />
         {isCompose ?
            <SendBox /> :
            <></>
         }
      </div>
   )
}