import { useState, useMemo } from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
   const [lastName, setLastName] = useState<string>("example");
   const [firstName, setFirstName] = useState<string>("example");
   const [email, setEmail] = useState<string>("");
   const [phone, setPhone] = useState<string>("example");
   const [password, setPassword] = useState<string>("");
   const [confirm, setConfirm] = useState<boolean>(true)

   const [emailHelper, setEmailHelper] = useState<string>("")
   const [passHelper, setPassHelper] = useState<string>("")

   const emailHandle = (value: string) => {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (isEmail.test(value)) {
         setEmail(value)
         setEmailHelper("")
      }
      else {
         setEmailHelper("Please enter correct format of email")
      }
   }

   const phoneHandle = (value: string) => {
      const isPhone = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
      if (isPhone.test(value)) {
         setPhone(value)
      } else {
         setPhone("")
      }
   }

   const passwordHandle = (value: string) => {
      const isContainUpper = /^(?=.*[A-Z])/;
      const isContainNumber = /^(?=.*[0-9])/;
      const isValidLength = /^.{6,16}$/;

      if (isValidLength.test(value)) {
         if (isContainUpper.test(value) && isContainNumber.test(value)) {
            setPassword(value)
            setPassHelper("")
         } else {
            setPassHelper("Password must contain at least 1 Uppercase character and 1 number.")
         }
      } else {
         setPassHelper("Password must be 6-16 characters long.")
      }
   }

   const [eye, setEye] = useState(false);
   const eyeHandle = () => {
      setEye(!eye);
   }

   const [validation, setValidation] = useState(false);
   const submitHandle = () => {
      if (lastName != "" && firstName != "" && email != "" && phone != "" && password != "" && confirm == true) {
         setValidation(true);
      }
   }

   return (
      <main>
         <div className="w-1/2 p-10 border border-white">
            <form action="POST" className="flex flex-col gap-16">
               <div className="flex justify-evenly">
                  <TextField label="Last Name" id="lastName" name="lastName" onChange={(e) => {
                     if (e.target.value) {
                        setLastName(e.target.value)
                     }
                  }} />
                  <TextField label="First Name" id="firstName" name="firstName" />
               </div>
               <TextField error={emailHelper != ""} helperText={emailHelper} label="Email" id="email" name="email" onChange={(e) => { emailHandle(e.target.value) }} />
               <TextField error={phone == ""} helperText={phone == "" ? "Plese enter existed phone number" : ""} type="number" label="Phone" id="phone" name="phone" onChange={(e) => { phoneHandle(e.target.value) }} InputProps={{
                  startAdornment: <InputAdornment position='start'>+84</InputAdornment>
               }} />
               <TextField error={passHelper != ""} helperText={passHelper} type={eye ? 'text' : 'password'} onChange={(e) => { passwordHandle(e.target.value) }} label="Password" id="password" name="password" InputProps={{
                  endAdornment: <InputAdornment position='end'>
                     <IconButton onClick={eyeHandle}>
                        {eye ? <VisibilityIcon /> : <VisibilityOffIcon />}
                     </IconButton>
                  </InputAdornment>
               }} />
               <TextField error={!confirm} helperText={confirm ? "" : "Password does not match"} type={eye ? 'text' : 'password'} label="Confirm Password" id="confirm" name="confirm" InputProps={{
                  endAdornment: <InputAdornment position='end'>
                     <IconButton onClick={eyeHandle}>
                        {eye ? <VisibilityIcon /> : <VisibilityOffIcon />}
                     </IconButton>
                  </InputAdornment>
               }} onChange={e => {
                  if (e.target.value == password) {
                     setConfirm(true)
                  } else {
                     setConfirm(false)
                  }
               }} />
               <Button disabled={validation == false} id="loginBtn" name="login" type='submit' variant='contained' onSubmit={submitHandle}>Login</Button>
            </form>
         </div>
      </main>
   );
}