"use client"

import logo from '@/public/images-home/wallet-ai-icono.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { User } from '../schemas/schemas';
import { useRouter } from 'next/navigation'; 

export default function SignUp () {

    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: "",
    })

    const [checkBox, setCheckBox] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");

    const router = useRouter();

    async function postUser (e: any) {
        e.preventDefault()

        setMessage("Loading...")

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/postUser`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                })
            })

            const data = await response.json()
            console.log(data)

            if (response.status != 200 || data.message) {
                setMessage(data.message)
                return
            }

            router.push('/login')

        } catch (error) {
            console.log("Error in postUser frontend: ", error);
        } finally {
            setTimeout(() => setMessage(""), 10000);
        }
    }

    return (
        <>
            <div className='grid min-h-dvh grid-cols-[1fr] bg-white text-gray-900 sm:grid-cols-[1fr_1fr]'>
                <div className='flex flex-col px-6 py-8 sm:px-10'>
                    <div onClick={() => router.push("/")} className='flex w-fit cursor-pointer flex-row items-center gap-1'>
                        <Image src={logo} width={40} height={40} alt='logo'></Image>
                        <p className='flex text-[1.5rem] font-bold text-gray-900'>Wallet-<span className='bg-linear-to-t from-green-800 to-green-500 bg-clip-text text-transparent'>AI</span></p>
                    </div>
                    <form onSubmit={(e) => postUser(e)} className='mx-auto my-auto flex w-full max-w-md flex-col gap-8 py-10'>
                        <div className='flex flex-col'>
                           <h1 className='text-4xl font-bold tracking-tight'>Create account</h1>
                            <p className='mt-1 text-[1.05rem] text-gray-600'>Take less than a minute.</p> 
                        </div>
                        <div className='flex flex-col gap-4'>
                            <label className='flex flex-col gap-1.5'>
                                <span className='text-sm font-semibold text-gray-800'>Username:</span>
                                <input onChange={(e) => setUser({...user, username: e.target.value})} placeholder='Your name...' className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-green-600/30'></input>
                            </label>
                            <label className='flex flex-col gap-1.5'>
                                <span className='text-sm font-semibold text-gray-800'>Email:</span>
                                <input onChange={(e) => setUser({...user, email: e.target.value})} type='email' placeholder='example@exam.com' className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-green-600/30'></input>
                            </label>
                            <label className='flex flex-col gap-1.5'>
                                <span className='text-sm font-semibold text-gray-800'>Password:</span>
                                <input type="password" onChange={(e) => setUser({...user, password: e.target.value})} placeholder='Thebestpageaboutofpersonalfinances' className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-green-600/30'></input>
                                <span className='text-[0.85rem] text-gray-500'>Minimum 8 characters</span>
                            </label>
                        </div>                        
                        <div className='flex w-full items-center gap-2 text-sm text-gray-700'>
                            <input onChange={(e) => setCheckBox(e.target.checked)} type='checkbox' className='h-4 w-4 cursor-pointer accent-green-700'></input>
                            <p>Acepto los terminos y Avisos de privacidad</p>
                        </div>
                        <div className='flex flex-col gap-3 text-center text-gray-600'>
                            <p className={'m-0 min-h-5 w-full p-0 text-right text-[0.9rem]' + (message.toLowerCase().includes("loading") ? ' text-green-700 ' : ' text-red-600 ')}>{message}</p>
                            <button type='submit' className='w-full cursor-pointer rounded-lg bg-brand p-3 font-bold text-white shadow-md shadow-green-900/20 transition duration-200 hover:bg-brand-dark active:scale-98 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'>Create account</button>
                            <p>Already have an account? <Link href={'/login'} className='font-semibold text-green-700 underline-offset-4 hover:underline'>Log in</Link></p>                   
                        </div>
                    </form>
                </div>
                <div className='bg-[url("@/public/image-login/image_login.png")] bg-cover bg-center bg-no-repeat w-full h-dvh sticky top-0 hidden sm:flex'></div>
            </div>
        </>
    )
}