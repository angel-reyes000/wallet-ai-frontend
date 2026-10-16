"use client"

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images-home/wallet-ai-icono.png';
import { FaHome } from 'react-icons/fa';
import './menu.css';
import { LuMenu } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export default function Menu () {

    const router = useRouter();

    return (
        <>
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
                        <p className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <FaHome size={20} />Moviments
                        </p>
                    </div>
                </div>                
                <div className='menu_letter_emailname'>
                    <p className='menu_letter'>A</p>
                    <div className='menu_emailname'>
                        <p>nombre</p>
                        <p>correo</p>
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
                        <p className='flex items-center hover:bg-[rgb(5,100,0)] hover:text-white p-2 rounded-lg gap-2'>
                            <FaHome size={20} />Moviments
                        </p>
                    </div>
                </div>                
                <div className='menu_letter_emailname'>
                    <p className='menu_letter'>A</p>
                    <div className='menu_emailname'>
                        <p>nombre</p>
                        <p>correo</p>
                    </div>
                </div>
            </div>
        </>
    )
}