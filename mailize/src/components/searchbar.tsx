import { styled, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

export default function SearchBar() {

   const router = useRouter()
   const [data, setData] = useState<string>("")

   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key == "Enter") {
         router.push("/mail/search" + "/" + data)
      }
   }

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setData(e.target.value)
   }

   return (
      <div className='w-full md:w-1/3 max-h-full'>
         <div className='md:pl-4 md:bg-[#272727] md:py-3 relative w-full rounded-lg'>
            <input
               placeholder="Search in mail"
               onKeyDown={handleKeyPress}
               onChange={(e) => handleChange(e)}
               value={data}
               className='w-full h-full bg-[#1b2a2d] md:bg-[#272727] md:h-[15px] border-none outline-none'
            />
         </div>
      </div>
   );
}