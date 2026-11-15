"use client"

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images-home/wallet-ai-icono.png';
import { FaHome, FaCreditCard } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import './menu.css';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { LuMenu, LuArrowUpDown } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { dataUser } from '@/app/schemas/schemas'; 
import { jwtDecode } from 'jwt-decode'; 

export default function Menu () {
    const [dataUser, setDataUser] = useState<dataUser>(); 

    const refModal = useRef<HTMLDialogElement>(null);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const { exp } = jwtDecode(token!)

        const expired = (exp! * 1000) - Date.now();

        setTimeout(() => {
            console.log("Session expired")
            refModal.current?.showModal();
            refModal.current!.style.display = 'flex';
            return
        }, expired)

        async function getDataUser () {
            
            refModal.current!.style.display = 'none';

            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/getDataUser`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                if (response.status != 200) {
                    console.log("Session expired")
                    refModal.current?.showModal();
                    refModal.current!.style.display = 'flex';
                    return
                }

                const data = await response.json()

                setDataUser(data);

            } catch (error) {
                console.log("Error in getDataUser: ", error);
            }
        }

        getDataUser();

    }, [])

    function redirectionLogin () {
        router.push('/login');
        refModal.current!.style.display = 'none';
        refModal.current!.close();
    }

    return (
        <>
            <dialog ref={refModal} className='m-auto flex w-[90%] max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-app-surface p-6 text-white shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm'>
                <div className='flex items-center justify-center w-full'>
                    <FaTriangleExclamation size={52} className='rounded-full bg-black/40 p-3 text-yellow-400' />
                </div>
                <div className='flex justify-between'>
                    <p className='w-full text-center text-xl font-bold'>Session expired!</p>
                </div>                
                <div className='flex flex-row'>
                    <button onClick={() => redirectionLogin()}
                        className='btn btn-primary w-full py-2.5'>
                            Log in
                    </button>
                </div>
            </dialog>
            {/*----------------------------------MENU ORIGINAL---------------------------------*/}
            <div className='menu_animation_open'>
                <div className='menu_header_and_sections'>
                    <div className='menu_header'>
                        <div className='menu_icon'>
                          <LuMenu size={40} />  
                        </div>      
                        <div onClick={() => router.push('/')} className='menu_logo'>
                            <Image src={logo} width={40} height={40} alt='logo'></Image>
                            <p className='flex text-[1.2rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-600 to-green-300 bg-clip-text text-transparent'>AI</span></p>                      
                        </div>                  
                    </div>
                    <div className='menu_sections'>
                        <Link href={'/wallet_ai'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FaHome size={20} />Resume
                        </Link>
                        <Link href={'/wallet_ai/transactions'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <LuArrowUpDown size={20} />Transactions
                        </Link>
                        <Link href={'/wallet_ai/cards'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FaCreditCard size={20} />Cards
                        </Link>
                        <Link href={'/wallet_ai/configuration'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FiSettings size={20} />Configuration
                        </Link>
                    </div>
                </div>                
                <div className='menu_letter_emailname'>
                    <p className='menu_letter'>{dataUser?.username[0].toUpperCase()}</p>
                    <div className='menu_emailname'>
                        <p>{dataUser?.username}</p>
                        <p>{dataUser?.email}</p>
                    </div>
                </div>
            </div>
            {/*----------------------------------MENU FAKE-------------------------------------*/}
            <div className='menu_animation_open' style={{'position': 'static'}}>
                <div className='menu_header_and_sections'>
                    <div className='menu_header'>
                        <div className='menu_icon'>
                          <LuMenu size={40} />  
                        </div>      
                        <div onClick={() => router.push('/')} className='menu_logo'>
                            <Image src={logo} width={40} height={40} alt='logo'></Image>
                            <p className='flex text-[1.2rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-600 to-green-300 bg-clip-text text-transparent'>AI</span></p>                      
                        </div>                  
                    </div>
                    <div className='menu_sections'>
                        <Link href={'/wallet_ai'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FaHome size={20} />Resume
                        </Link>
                        <Link href={'/wallet_ai/transactions'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <LuArrowUpDown size={20} />Transactions
                        </Link>
                        <Link href={'/wallet_ai/cards'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FaCreditCard size={20} />Cards
                        </Link>
                        <Link href={'/wallet_ai/configuration'} className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-green-50/90 transition-colors duration-200 hover:bg-green-700 hover:text-white focus-visible:outline-2 focus-visible:outline-green-400'>
                            <FiSettings size={20} />Configuration
                        </Link>
                    </div>
                </div>                
                <div className='menu_letter_emailname'>
                    <p className='menu_letter'>{dataUser?.username[0].toUpperCase()}</p>
                    <div className='menu_emailname'>
                        <p>{dataUser?.username}</p>
                        <p>{dataUser?.email}</p>
                    </div>
                </div>
            </div>
        </>
    )
}