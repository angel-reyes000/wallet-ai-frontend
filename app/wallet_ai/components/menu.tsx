"use client"

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images-home/wallet-ai-icono.png';
import { FaHome, FaCalendarAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import './menu.css';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { LuMenu, LuArrowUpDown } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { dataUser } from '@/app/schemas/schemas'; 

export default function Menu () {
    const [dataUser, setDataUser] = useState<dataUser>(); 

    const refModal = useRef<HTMLDialogElement>(null);

    const router = useRouter();

    useEffect(() => {
        async function getDataUser () {

            const token = localStorage.getItem('token');
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
            <dialog ref={refModal} className='flex flex-col m-auto max-w-[50%] p-5 rounded-lg gap-2'>
                <div className='flex items-center justify-center w-full'>
                    <FaTriangleExclamation size={50} className='bg-black text-yellow-500 p-1 rounded-4xl' />
                </div>
                <div className='flex justify-between'>
                    <p className='font-bold text-xl'>Session expired!</p>
                </div>                
                <div className='flex flex-row'>
                    <button onClick={() => redirectionLogin()}
                        className='flex flex-row items-center justify-center p-2 rounded-lg text-white font-semibold bg-[rgb(5,100,0)] cursor-pointer w-full hover:bg-[rgb(5,80,0)] active:scale-95'>
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
                            <p className='flex text-black text-[1.2rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-900 to-green-200 bg-clip-text text-transparent'>AI</span></p>                      
                        </div>                  
                    </div>
                    <div className='menu_sections'>
                        <Link href={'/wallet_ai'} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <FaHome size={20} />Resume
                        </Link>
                        <Link href={'/wallet_ai/transactions'} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <LuArrowUpDown size={20} />Transactions
                        </Link>
                        <Link href={''} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <FaCalendarAlt size={20} />Recurring expenses
                        </Link>
                        <Link href={'/wallet_ai/configuration'} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
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
                            <p className='flex text-black text-[1.2rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-900 to-green-200 bg-clip-text text-transparent'>AI</span></p>                      
                        </div>                  
                    </div>
                    <div className='menu_sections'>
                        <Link href={'/wallet_ai'} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <FaHome size={20} />Resume
                        </Link>
                        <Link href={'/wallet_ai/transactions'} className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <LuArrowUpDown size={20} />Transactions
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