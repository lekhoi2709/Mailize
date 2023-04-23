import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {

   const StyledInputBase = styled(InputBase)(({ theme }) => ({
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
   }));

   return (
      <div className='w-full md:w-1/3 max-h-full'>
         <div className='relative w-full bg-[#272727] rounded-lg'>
            <div className='pl-3 absolute flex items-center justify-center w-fit h-full pointer-events-none'>
               <SearchIcon />
            </div>
            <StyledInputBase
               placeholder="Search in mail"
               inputProps={{ 'aria-label': 'search' }}
            />
         </div>
      </div>
   );
}