"use client"

import logo from '@/public/images-home/wallet-ai-icono.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { User } from '../schemas/schemas';
import { useRouter } from 'next/navigation'; 

export default function Login () {

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
    })

    const [checkBox, setCheckBox] = useState<boolean>(false);

    const router = useRouter();

    return (
        <>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr]'>
                <div className='flex flex-col px-10 pt-10'>
                    <div onClick={() => router.push("/")} className='flex flex-row items-center cursor-pointer'>
                        <Image src={logo} width={40} height={40} alt='logo'></Image>
                        <p className='flex text-black text-[1.5rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-900 to-green-200 bg-clip-text text-transparent'>AI</span></p>
                    </div>
                    <form className='flex flex-col px-0 pt-5 md:px-5 md:pt-10 lg:px-10 lg:pt-10  gap-10'>
                        <div className='flex flex-col'>
                           <h1 className='text-4xl font-bold'>Log in</h1>
                            <p className='text-[1.1rem]'>Welcome again!</p> 
                        </div>
                        <div className='flex flex-col gap-3'>
                            <label className='flex flex-col'>
                                <span className='font-semibold'>Email:</span>
                                <input onChange={(e) => setUser({...user, email: e.target.value})} type='email' placeholder='example@exam.com' className='border-2 border-gray-400 rounded-sm p-2'></input>
                            </label>
                            <label className='flex flex-col'>
                                <span className='font-semibold'>Password:</span>
                                <input onChange={(e) => setUser({...user, password: e.target.value})} placeholder='Thebestpageaboutofpersonalfinances' className='border-2 border-gray-400 rounded-sm p-2'></input>
                                <span className='text-gray-600 text-[0.9rem]'>Minimum 8 characters</span>
                            </label>
                        </div>                        
                        <div className='flex justify-center w-full gap-2'>
                            <input onChange={(e) => setCheckBox(e.target.checked)} type='checkbox' className='cursor-pointer w-[15px]'></input>
                            <p>Acepto los terminos y Avisos de privacidad</p>
                        </div>
                        <div className='flex flex-col gap-2 text-center'>
                            <button type='submit' className='w-full p-3 bg-[rgb(5,100,0)] text-white cursor-pointer font-bold rounded-lg hover:bg-[rgb(5,80,0)] active:scale-98'>Create account</button>
                            <p>Don't have an account? <Link href={'/signup'} className='text-green-700 hover:underline'>Sign up</Link></p>                   
                        </div>
                    </form>
                </div>
                <div className='bg-[url("@/public/image-login/image_login.png")] bg-cover bg-center bg-norepeat w-full h-dvh hidden sm:flex'></div>
            </div>
        </>
    )
}