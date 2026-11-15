"use client"

import logo from '@/public/images-home/wallet-ai-icono.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { User } from '../schemas/schemas';
import { useRouter } from 'next/navigation'; 
import { validateLogin, hasErrors, apiErrorMessage, type FieldErrors } from '../schemas/validation';

export default function Login () {

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
    })

    const [message, setMessage] = useState<string>("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const loading = message.toLowerCase().includes("loading");

    const router = useRouter();

    async function verifyUser (e: any) {
        e.preventDefault();

        if (loading) return;

        const found = validateLogin(user);
        setErrors(found);

        if (hasErrors(found)) return;

        setMessage("Loading...");

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/verifyUser`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email.trim(),
                    password: user.password,
                })
            })

            const data = await response.json()

            if (response.status != 200 || data.message) {
                setMessage(apiErrorMessage(data))
                //console.log(data.message)
                return
            }

            localStorage.setItem('token', data)
            router.push('/')
            console.log(data)

        } catch (error) {
            console.log("Error in verifyUser frontend: ", error);
            setMessage("Could not reach the server, try again.");
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
                    <form noValidate onSubmit={(e) => verifyUser(e)} className='mx-auto my-auto flex w-full max-w-md flex-col gap-8 py-10'>
                        <div className='flex flex-col'>
                           <h1 className='text-4xl font-bold tracking-tight'>Log in</h1>
                            <p className='mt-1 text-[1.05rem] text-gray-600'>Welcome again!</p> 
                        </div>
                        <div className='flex flex-col gap-4'>
                            <label className='flex flex-col gap-1.5'>
                                <span className='text-sm font-semibold text-gray-800'>Email:</span>
                                <input onChange={(e) => { setUser({...user, email: e.target.value}); setErrors(prev => ({...prev, email: ''})) }} type='email' autoComplete='email' maxLength={100} aria-invalid={!!errors.email} aria-describedby='email-error' placeholder='example@exam.com' className={'w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 ' + (errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-brand focus:ring-green-600/30')}></input>
                                {errors.email && <span id='email-error' role='alert' className='text-[0.85rem] text-red-600'>{errors.email}</span>}
                            </label>
                            <label className='flex flex-col gap-1.5'>
                                <span className='text-sm font-semibold text-gray-800'>Password:</span>
                                <input type="password" onChange={(e) => { setUser({...user, password: e.target.value}); setErrors(prev => ({...prev, password: ''})) }} autoComplete='current-password' maxLength={128} aria-invalid={!!errors.password} aria-describedby='password-error' placeholder='Thebestpageaboutofpersonalfinances' className={'w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 ' + (errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-brand focus:ring-green-600/30')}></input>
                                {errors.password && <span id='password-error' role='alert' className='text-[0.85rem] text-red-600'>{errors.password}</span>}
                                <span className='text-[0.85rem] text-gray-500'>Minimum 8 characters</span>
                            </label>
                        </div>                        
                        <div className='flex flex-col gap-3 text-center text-gray-600'>
                            <p role='alert' className={'m-0 min-h-5 w-full p-0 text-right text-[0.9rem]' + (message.toLowerCase().includes("loading") ? ' text-green-700 ' : ' text-red-600 ')}>{message}</p>
                            <button type='submit' disabled={loading} className='w-full cursor-pointer rounded-lg bg-brand p-3 font-bold text-white shadow-md shadow-green-900/20 transition duration-200 hover:bg-brand-dark active:scale-98 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60'>Log in</button>
                            <p>Don't have an account? <Link href={'/signup'} className='font-semibold text-green-700 underline-offset-4 hover:underline'>Sign up</Link></p>                   
                        </div>
                    </form>
                </div>
                <div className='bg-[url("@/public/image-login/image_login.png")] bg-cover bg-center bg-no-repeat w-full h-dvh sticky top-0 hidden sm:flex'></div>
            </div>
        </>
    )
}