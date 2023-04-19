import { useState, useEffect, useMemo } from 'react'
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

type Validate = {
   lastName: string,
   firstName: string,
   email: string,
   phone: string,
   passHelper: string,
   confirm: boolean
}

export default function Register() {
   const [lastName, setLastName] = useState<string>("Doe");
   const [firstName, setFirstName] = useState<string>("John");
   const [email, setEmail] = useState<string>("example@example.com");
   const [phone, setPhone] = useState<string>("0909123123");
   const [password, setPassword] = useState<string>("Example1");
   const [confirm, setConfirm] = useState<boolean>(true)

   const [passHelper, setPassHelper] = useState<string>("")

   const emailHandler = (value: string) => {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (isEmail.test(value)) {
         setEmail(value)
      }
      else {
         setEmail("")
      }
   }

   const phoneHandler = (value: string) => {
      const isPhone = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
      if (isPhone.test(value)) {
         setPhone(value)
      } else {
         setPhone("")
      }
   }

   const passwordHandler = (value: string) => {
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

   const validation = useMemo<boolean>(() => {
      const submitValidate = (props: Validate) => {
         if (props.lastName != "" && props.firstName != "" && props.email != "" && props.phone != "" && props.passHelper == "" && props.confirm) {
            return true
         } else {
            return false
         }
      }
      return submitValidate({ lastName, firstName, email, phone, passHelper, confirm })
   }, [lastName, firstName, email, phone, passHelper, confirm])

   const submitHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()

      const payload = {
         email,
         phone,
         password,
         lastName,
         firstName,
      }

      try {
         const { data } = await axios({
            url: "http://localhost:8080/api/auth/register",
            method: "POST",
            data: payload
         })

         console.log(data)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <>
         <div className="w-1/2 p-10 border border-white">
            <div className="flex flex-col gap-16">
               <div className="flex justify-evenly">
                  <TextField error={lastName == ""} helperText={lastName != "" ? "" : "Please enter your last name"} label="Last Name" id="lastName" name="lastName" onChange={(e) => { setLastName(e.target.value) }} />
                  <TextField error={firstName == ""} helperText={firstName != "" ? "" : "Please enter your first name"} label="First Name" id="firstName" name="firstName" onChange={(e) => { setFirstName(e.target.value) }} />
               </div>
               <TextField error={email == ""} helperText={email != "" ? "" : "Please enter correct format of email"} label="Email" id="email" name="email" onChange={(e) => { emailHandler(e.target.value) }} />
               <TextField error={phone == ""} helperText={phone != "" ? "" : "Plese enter existed phone number"} type="tel" label="Phone" id="phone" name="phone" onChange={(e) => { phoneHandler(e.target.value) }} InputProps={{
                  startAdornment: <InputAdornment position='start'>+84</InputAdornment>
               }} />
               <TextField error={passHelper != ""} helperText={passHelper} type={eye ? 'text' : 'password'} onChange={(e) => { passwordHandler(e.target.value) }} label="Password" id="password" name="password" InputProps={{
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
               <Button disabled={!validation} id="loginBtn" name="login" type='submit' variant='contained' onClick={e => submitHandler(e)} className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7]">Register</Button>
            </div>
         </div>
      </>
   );
}