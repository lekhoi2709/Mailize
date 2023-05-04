import { styled, InputBase } from '@mui/material';

export default function SearchBar() {

   const StyledInputBase = styled(InputBase)(({ theme }) => ({
      padding: theme.spacing(1, 1, 0.5, 0),
      transition: theme.transitions.create('width'),
      width: '100%',
   }));

   return (
      <div className='w-full md:w-1/3 max-h-full'>
         <div className='md:pl-4 md:bg-[#272727] focus-within:md:bg-zinc-700 relative w-full rounded-lg'>
            <StyledInputBase
               placeholder="Search in mail"
               inputProps={{ 'aria-label': 'search' }}
            />
         </div>
      </div>
   );
}