import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useState, useEffect, useRef } from 'react'

import {
   TextField,
   Button,
   IconButton,
   Backdrop,
   CircularProgress
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorIcon from "@mui/icons-material/Error"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import { Dancing_Script, Lora } from "next/font/google";

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { getCsrfToken, signIn } from "next-auth/react";

import axios from "axios";
//

const dancing = Dancing_Script({
   subsets: ["latin"],
});

const lora = Lora({ subsets: ["latin"] });

interface FormInput {
   email: string,
   password: string,
   confirm: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
   return {
      props: {
         csrfToken: await getCsrfToken(context)
      }
   }
}

//
export default function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const formSchema = Yup.object().shape({
      email: Yup.string()
         .required("Please enter your email")
         .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Please enter the correct format of email"),
      password: Yup.string()
         .required("Please enter your password")
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/, "Password must contain at least 6 characters, 1 number and 1 uppercase"),
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
      if (router.asPath == "/auth/login") {
         router.push("/api/auth/signin", undefined, { shallow: true })
      }
   }, [router])

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
      router.push('/auth/login', undefined, { shallow: true })
   }

   const onSubmit: SubmitHandler<FormInput> = async (data) => {
      const { email, password } = data
      const payload = {
         email: email.trim(),
         password: password.trim()
      }

      setLoading(true)

      try {
         const data = await axios({
            url: "http://localhost:8080/api/auth/forgot",
            method: "PUT",
            headers: {
               "Content-Type": "application/json"
            },
            data: payload
         })

         timerRef.current = setTimeout(() => {
            setLoading(false)
            if (data.status == 200) {
               setSuccess(data.data?.msg)
            } else {
               setSuccess(data.data?.msg)
            }
         }, 1500)

      } catch (err: any) {
         timerRef.current = setTimeout(() => {
            setLoading(false)
            if (err.response.data.msg) {
               setError(err.response.data.msg)
            } else {
               console.log(err)
            }
         }, 1500)
      }
   };

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
         <main className="backdrop-blur-lg w-full h-full md:h-fit md:w-1/2 p-6 bg-[#121212]/80 md:bg-[#121212]/70 md:border-[#121212]/70 md:p-10 md:border md:rounded-lg relative">
            <section className='flex flex-col gap-4 mb-10 md:mb-8'>
               <Link href="/" className="w-fit h-fit">
                  <h1 className={`${dancing.className} text-4xl text-[#006fff]`}>Mailize</h1>
               </Link>
               <h1 className="text-lg">Change Password</h1>
            </section>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 md:justify-evenly w-full">
               <TextField
                  error={Boolean(errors.email)}
                  helperText={errors?.email?.message}
                  label="Email"
                  id="email"
                  size='small'
                  InputProps={{ style: { fontSize: 15 } }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  {...register('email')}
               />
               <div className="flex flex-col gap-8 md:gap-6 md:flex-row w-full">
                  <TextField
                     error={Boolean(errors.password)}
                     helperText={errors?.password?.message}
                     type={eye ? 'text' : 'password'}
                     label="New Password"
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
                     label="Confirm Password"
                     id="confirm"
                     className='w-full'
                     size='small'
                     InputProps={{ style: { fontSize: 15 } }}
                     InputLabelProps={{ style: { fontSize: 15 } }}
                     {...register('confirm')}
                  />
               </div>
               <TextField
                  type="hidden"
                  name="csrfToken"
                  defaultValue={csrfToken}
                  className="hidden"
               />
               <div className='flex items-center gap-2'>
                  <IconButton onClick={eyeHandle} size='small'>
                     {eye ? <VisibilityIcon fontSize='inherit' /> : <VisibilityOffIcon fontSize='inherit' />}
                  </IconButton>
                  <p className='text-sm'>Show password</p>
               </div>
               <section className='flex justify-between'>
                  <Link href="/auth/register">
                     <Button
                        variant="text"
                        className="text-[#006fff] w-28 md:w-40 h-10">
                        Create Account
                     </Button>
                  </Link>
                  <Button
                     id="loginBtn"
                     name="login"
                     type='submit'
                     variant='contained'
                     className="bg-[#006fff] hover:bg-[#213ABF] text-[#e7e7e7] w-28 md:w-40 h-10">{isLoading ? <CircularProgress size={"1.5rem"} /> : "Change"}
                  </Button>
               </section>
            </form>

            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={error != undefined}
               onClick={closeBackDrop}
               className="flex items-center justify-center"
            >
               <div className="h-fit w-fit px-6 py-16 bg-[#121212] font-bold text-rose-600 flex gap-3 items-center justify-center">
                  <ErrorIcon />
                  <p>{error}</p>
               </div>
            </Backdrop>
            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={success != undefined}
               onClick={closeAndRedirectBackDrop}
               className="flex flex-col items-center justify-center"
            >
               <div className="h-fit w-fit px-6 py-16 bg-[#121212] font-bold text-green-500 flex gap-3 items-center justify-center">
                  <CheckCircleIcon />
                  <p>{success}</p>
               </div>
            </Backdrop>
         </main>
      </div >
   );
}