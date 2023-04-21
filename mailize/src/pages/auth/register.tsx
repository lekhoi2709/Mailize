import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/router";

import { useState, useEffect, useRef } from 'react'
import { TextField, Button, InputAdornment, IconButton, Backdrop } from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axios from 'axios';

import { Dancing_Script, Lora } from "next/font/google";

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

//

const dancing = Dancing_Script({
   subsets: ["latin"],
});

const lora = Lora({ subsets: ["latin"] });

interface FormInput {
   lastName: string,
   firstName: string,
   email: string,
   phone: string,
   password: string,
   confirm: boolean
}

export default function Register() {

   const formSchema = Yup.object().shape({
      lastName: Yup.string()
         .required("Please enter your last name"),
      firstName: Yup.string()
         .required("Please enter your first name"),
      email: Yup.string()
         .required("Please enter your email")
         .matches(/^[a-zA-Z0-9]+$/g, "Email does not contain white space or special characters"),
      phone: Yup.string()
         .required("Please enter your phone number")
         .matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, "Please enter existed phone number"),
      password: Yup.string()
         .required("Please enter your password")
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password must contain at least 6 characters, 1 number and 1 uppercase"),
      confirm: Yup.string()
         .required("Please confirm your password")
         .oneOf([Yup.ref('password')], "Password does not match")
   })

   const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({ mode: "onTouched", resolver: yupResolver(formSchema) })

   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

   const [isLoading, setLoading] = useState<boolean>(false)

   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()

   const router = useRouter()


   useEffect(() => {
      clearTimeout(timerRef.current)
   }, [])

   const [eye, setEye] = useState(false);
   const eyeHandle = () => {
      setEye(!eye);
   }

   const closeBackDrop = () => {

      setError(undefined)
   }

   const closeAndRedirectBackDrop = () => {
      setSuccess(undefined)
      timerRef.current = setTimeout(() => {
         router.push('/api/auth/signin', undefined, { shallow: true })
      })
   }

   const onSubmit: SubmitHandler<FormInput> = async (data) => {
      const email = data.email.trim() + "@mailize.com",
         phone = data.phone.trim(),
         lastName = data.lastName.trim(),
         firstName = data.firstName.trim(),
         password = data.password.trim()

      const payload = {
         email, phone, lastName, firstName, password
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
         if (data.status == 200) {
            setSuccess(data.data?.msg)
         }
      } catch (err: any) {
         if (err.response.data.msg.keyPattern.username) {
            setError("That email is taken. Try another")
         } else if (err.response.data.msg.keyPattern.phone) {
            setError("That phone number is taken. Try another")
         } else {
            console.log(err)
         }
      }

      // console.log(payload)
      timerRef.current = setTimeout(() => {
         setLoading(false)
      }, 1500)
   };

   return (
      <div className={`${lora.className} md:flex md:justify-center md:items-center w-screen h-screen`}>
         <picture className="w-full h-screen absolute z-0">
            <Image
               src="/images/bg3.jpg"
               alt=""
               fill
               className="contain"
               priority
            />
         </picture>
         <main className=" backdrop-blur-lg w-full h-full md:h-fit md:w-1/2 p-6 bg-[#121212]/80 md:bg-[#121212]/70 md:p-10 md:border md:border-[#121212]/70 rounded-lg relative">
            <section className='flex flex-col gap-4 mb-10 md:mb-8'>
               <Link href="/" className="w-fit h-fit">
                  <h1 className={`${dancing.className} text-4xl text-[#2B4EFF]`}>Mailize</h1>
               </Link>
               <h1 className="text-lg">Create Account for Mailize</h1>
            </section>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 md:justify-evenly w-full">
               <div className="flex flex-col gap-8 md:flex-row md:gap-6 w-full">
                  <TextField
                     error={Boolean(errors.lastName)}
                     helperText={errors?.lastName?.message}
                     label="Last Name"
                     id="lastName"
                     size='small'
                     className='w-full text-sm'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                     {...register('lastName')}
                  />
                  <TextField
                     error={Boolean(errors.firstName)}
                     helperText={errors?.firstName?.message}
                     label="First Name"
                     id="firstName"
                     size='small'
                     className='w-full'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                     {...register('firstName')}
                  />
               </div>

               <TextField
                  error={Boolean(errors.email)}
                  helperText={errors?.email?.message}
                  label="Email"
                  id="email"
                  size='small'
                  InputProps={{
                     style: { fontSize: 15 },
                     endAdornment: <InputAdornment position="end">@mailize.com</InputAdornment>
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  {...register('email')}
               />
               <TextField
                  error={Boolean(errors.phone)}
                  helperText={errors?.phone?.message}
                  type="tel"
                  label="Phone"
                  id="phone"
                  size='small'
                  InputProps={{
                     startAdornment: <InputAdornment position='start'>+84</InputAdornment>,
                     style: { fontSize: 15 }
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  {...register('phone')}
               />

               <div className="flex flex-col gap-8 md:gap-6 md:flex-row w-full">
                  <TextField
                     error={Boolean(errors.password)}
                     helperText={errors?.password?.message}
                     type={eye ? 'text' : 'password'}
                     label="Password"
                     id="password"
                     size='small'
                     className='w-full'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                     {...register('password')}
                  />
                  <TextField
                     error={Boolean(errors.confirm)}
                     helperText={errors?.confirm?.message}
                     type={eye ? 'text' : 'password'}
                     label="Confirm"
                     id="confirm"
                     className='w-full'
                     size='small'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                     {...register('confirm')}
                  />
               </div>
               <div className='flex items-center gap-2'>
                  <IconButton onClick={eyeHandle} size='small'>
                     {eye ? <VisibilityIcon fontSize='inherit' /> : <VisibilityOffIcon fontSize='inherit' />}
                  </IconButton>
                  <p className='text-sm'>Show password</p>
               </div>
               <section className='flex justify-between'>
                  <Link href="/api/auth/signin">
                     <Button
                        variant="text"
                        className="text-[#2B4EFF] w-28 md:w-40 md:h-10">
                        Login
                     </Button>
                  </Link>
                  <Button
                     id="loginBtn"
                     name="login"
                     type='submit'
                     variant='contained'
                     className="bg-[#2B4EFF] hover:bg-[#213ABF] text-[#e7e7e7] w-28 md:w-40 md:h-10">{isLoading ? <CircularProgress size={"1.5rem"} /> : "Register"}
                  </Button>
               </section>
            </form>

            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={error != undefined}
               onClick={closeBackDrop}
               className="flex items-center justify-center"
            >
               <div className="w-1/3 h-1/3 bg-[#121212] text-rose-600 flex gap-3 items-center justify-center">
                  <ErrorIcon />
                  <p >{error}</p>
               </div>
            </Backdrop>
            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={success != undefined}
               onClick={closeAndRedirectBackDrop}
               className="flex flex-col items-center justify-center"
            >
               <div className="w-1/3 h-1/3 bg-[#121212] text-green-500 flex gap-3 items-center justify-center">
                  <CheckCircleIcon />
                  <p>{success}</p>
               </div>
            </Backdrop>
         </main>
      </div>
   );
}