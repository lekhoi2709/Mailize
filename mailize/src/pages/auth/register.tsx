import { useState, useEffect, useMemo, useRef } from 'react'
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Dancing_Script, Lora } from "next/font/google";
import Image from "next/image";
import Link from 'next/link';

const dancing = Dancing_Script({
   subsets: ["latin"],
});

const lora = Lora({ subsets: ["latin"] });

type Validate = {
   lastName: string,
   firstName: string,
   email: string,
   phone: string,
   passHelper: string,
   confirm: boolean
}

export default function Register() {
   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

   const [isLoading, setLoading] = useState<boolean>(false)
   const [lastName, setLastName] = useState<string>("Doe");
   const [firstName, setFirstName] = useState<string>("John");
   const [email, setEmail] = useState<string>("example@example.com");
   const [phone, setPhone] = useState<string>("123");
   const [password, setPassword] = useState<string>("Example1");
   const [confirm, setConfirm] = useState<boolean>(true)
   const [passHelper, setPassHelper] = useState<string>("")


   useEffect(() => {
      clearTimeout(timerRef.current)
   }, [])

   const submitHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()

      const payload = {
         email,
         phone,
         password,
         lastName,
         firstName,
      }

      setLoading(true)

      try {
         const data = await axios({
            url: "http://localhost:8080/api/auth/register",
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            data: payload
         })
         console.log(data)
      } catch (err) {
         console.log(err)
      }

      timerRef.current = setTimeout(() => {
         setLoading(false)
      }, 2000)
   }

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

   return (
      <div className={`${lora.className} md:flex md:justify-center md:items-center w-screen h-screen`}>
         <picture className="w-full h-screen absolute z-0">
            <Image
               src="/images/bg1.jpg"
               alt=""
               fill
               className="contain"
               priority
            />
         </picture>
         <main className="w-full h-full md:h-fit md:w-1/2 p-6 bg-[#121212] md:p-10 md:border md:border-[#121212] rounded-lg relative">
            <section className='flex flex-col gap-4 mb-10 md:mb-8'>
               <h1 className={`${dancing.className} text-4xl text-[#2B4EFF]`}>Mailize</h1>
               <h1 className="text-lg">Create Account for Mailize</h1>
            </section>
            <section className="flex flex-col gap-8 md:justify-evenly w-full">
               <div className="flex flex-col gap-8 md:flex-row md:gap-6 w-full">
                  <TextField
                     // error={lastName == ""}
                     // helperText={lastName != "" ? "" : "Please enter your last name"}
                     label="Last Name"
                     id="lastName"
                     name="lastName"
                     onChange={(e) => { setLastName(e.target.value) }}
                     size='small'
                     className='w-full text-sm'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                  <TextField
                     // error={firstName == ""}
                     // helperText={firstName != "" ? "" : "Please enter your first name"}
                     label="First Name"
                     id="firstName"
                     name="firstName"
                     onChange={(e) => { setFirstName(e.target.value) }}
                     size='small'
                     className='w-full'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                  />
               </div>

               <TextField
                  error={email == ""}
                  helperText={email != "" ? "" : "Please enter correct format of email"}
                  label="Email"
                  id="email"
                  name="email"
                  onChange={(e) => { emailHandler(e.target.value) }}
                  size='small'
                  InputProps={{ style: { fontSize: 15 } }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
               />
               <TextField
                  error={phone == ""}
                  helperText={phone != "" ? "" : "Plese enter existed phone number"}
                  type="tel"
                  label="Phone"
                  id="phone"
                  name="phone"
                  onChange={(e) => { phoneHandler(e.target.value) }}
                  size='small'
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>+84</InputAdornment>,
                     style: { fontSize: 15 }
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
               />

               <div className="flex flex-col gap-8 md:gap-6 md:flex-row w-full">
                  <TextField
                     error={passHelper != ""}
                     helperText={passHelper}
                     type={eye ? 'text' : 'password'}
                     onChange={(e) => { passwordHandler(e.target.value) }}
                     label="Password"
                     id="password"
                     name="password"
                     size='small'
                     className='w-full'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                  />
                  <TextField
                     error={!confirm}
                     helperText={confirm ? "" : "Password does not match"}
                     type={eye ? 'text' : 'password'}
                     label="Confirm"
                     id="confirm"
                     name="confirm"
                     className='w-full'
                     onChange={e => {
                        if (e.target.value == password) {
                           setConfirm(true)
                        } else {
                           setConfirm(false)
                        }
                     }}
                     size='small'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                  />
               </div>
               <div className='flex items-center gap-2'>
                  <IconButton onClick={eyeHandle} size='small'>
                     {eye ? <VisibilityIcon fontSize='inherit' /> : <VisibilityOffIcon fontSize='inherit' />}
                  </IconButton>
                  <p className='text-sm'>Show password</p>
               </div>
               <section className='flex justify-between'>
                  <Link href="/auth/login">
                     <Button
                        variant="text"
                        className="text-[#2B4EFF] w-28 md:w-40 md:h-10">
                        Login
                     </Button>
                  </Link>
                  <Button
                     disabled={!validation || isLoading}
                     id="loginBtn"
                     name="login"
                     type='submit'
                     variant='contained'
                     onClick={e => submitHandler(e)}
                     className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7] w-28 md:w-40 md:h-10">{isLoading ? <CircularProgress size={"1.5rem"} /> : "Register"}
                  </Button>
               </section>
            </section>
         </main>
      </div>
   );
}