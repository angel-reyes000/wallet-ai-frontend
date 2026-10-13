"use client"

import Image from 'next/image';
import logo from '@/public/images-home/wallet-ai-icono.png';
import logo_premium from '@/public/images-home/wallet-gold-negro.png';
import grafica from '@/public/images-home/grafica-balance-ancha-verde.png';
import step_1 from '@/public/images-home/login-ilustracion.png';
import step_2 from '@/public/images-home/boton-agregar-saldo.png';
import step_3 from '@/public/images-home/grafica-1350x681.png';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import security from '@/public/images-home/escudo-sin-fondo.png';
import { LuLockKeyhole, LuEyeOff, LuFileCheck, LuMenu } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react'; 

export default function Home () {

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  function scrollIntoViewMain () {
    document.getElementById("mainSection")?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  function scrollIntoViewSecurity () {
    document.getElementById("sectionSecurity")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  function scrollIntoViewWork () {
    document.getElementById("sectionWork")?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  function scrollIntoViewPlans () {
    document.getElementById("sectionPlans")?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  useEffect(() => {

    AOS.init({
      duration: 1000, 
      delay: 0,
      once: false,
    })

  }, [])

  return (
    <>
      {/*--------------------------------------------------ORIGINAL MENU----------------------------------------------------*/}
      <header className='fixed flex flex-col md:flex-row items-start md:items-center justify-between bg-[rgb(250,255,250)] px-10 md:px-20 lg:px-30 py-5 md:py-1 w-full z-10'>
        <div onClick={() => scrollIntoViewMain()} className='hidden md:flex items-center cursor-pointer gap-2'>
          <Image src={logo} width={40} height={40} alt='logo'></Image>
          <p className='flex text-black text-[1.5rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-900 to-green-200 bg-clip-text text-transparent'>AI</span></p>
        </div>
        <div className='hidden md:flex items-center gap-5 lg:gap-15'>
          <p onClick={() => scrollIntoViewWork()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>How does it work</p>
          <p onClick={() => scrollIntoViewSecurity()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Security</p>
          <p onClick={() => scrollIntoViewPlans()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Plans</p>
          <button className='px-5 py-3 bg-[rgb(5,100,0)] text-white rounded-md font-semibold cursor-pointer hover:bg-[rgb(5,80,0)] active:scale-95'>Log in</button>
        </div>
        {openMenu ? (
          <>
            <FaPlus onClick={() => setOpenMenu(!openMenu)} size={40} className='rotate-45 md:hidden' />
            <div className='flex flex-col md:hidden items-end w-full'>
              <p onClick={() => scrollIntoViewWork()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>How does it work</p>
              <p onClick={() => scrollIntoViewSecurity()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Security</p>
              <p onClick={() => scrollIntoViewPlans()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Plans</p>          
            </div>
          </>          
        ):(
          <LuMenu onClick={() => setOpenMenu(!openMenu)} size={40} className='flex md:hidden' />
        )}        
      </header>
      {/*--------------------------------------------------MENU FAKE----------------------------------------------------*/}
      <header className='flex flex-col md:flex-row items-start md:items-center justify-between bg-[rgb(250,255,250)] px-10 md:px-20 lg:px-30 py-5 md:py-1'>
        <div onClick={() => scrollIntoViewMain()} className='hidden md:flex items-center cursor-pointer gap-2'>
          <Image src={logo} width={40} height={40} alt='logo'></Image>
          <p className='flex text-black text-[1.5rem] font-bold mr-10'>Wallet-<span className='bg-linear-to-t from-green-900 to-green-200 bg-clip-text text-transparent'>AI</span></p>
        </div>
        <div className='hidden md:flex items-center gap-5 lg:gap-15'>
          <p onClick={() => scrollIntoViewWork()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>How does it work</p>
          <p onClick={() => scrollIntoViewSecurity()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Security</p>
          <p onClick={() => scrollIntoViewPlans()} className='text-black px-5 py-3 rounded-md font-semibold cursor-pointer active:scale-95 hover:bg-[rgb(5,100,0)] hover:text-white'>Plans</p>
          <button className='px-5 py-3 bg-[rgb(5,100,0)] text-white rounded-md font-semibold cursor-pointer hover:bg-[rgb(5,80,0)] active:scale-95'>Log in</button>
        </div>       
      </header>
      <main className='h-auto bg-red-100'>
        <section id='mainSection' className='grid grid-rows-[1fr_1fr] lg:grid-cols-[1fr_1fr] items-center justify-items-center bg-[url(@/public/images-home/fondo-cuadriculado.png)] px-10 md:px-20 lg:px-30 py-20'>
          <div className='flex flex-col gap-20 w-[90%]'>
            <div className='flex flex-col gap-5'>
              <h1 className='text-[3.5rem] font-black'>Knows where your money goes before it's gone</h1>
              <p className='text-[1.1rem] font-semibold'>Gather your accounts and see how much you have left at the end of the month.</p>
            </div>            
            <div className='flex justify-center md:justify-start'>
              <button data-aos="zoom-in" className='font-semibold w-full md:w-[40%] text-lg bg-[rgb(5,100,0)] text-white p-2 rounded-md cursor-pointer hover:bg-[rgb(5,80,0)] active:scale-95'>Start...</button>
            </div>
          </div>
          <Image data-aos="zoom-out" className='p-1' src={grafica} width={700} height={700} alt='grafica'></Image>
        </section>
        <section id="sectionWork" className='flex flex-col px-10 md:px-20 lg:px-30 py-20 bg-[rgb(250,255,250)] gap-10'>
          <h2 className='text-[2.5rem] font-bold'>¿How does it work?</h2>
          <div className='grid grid-rows-[1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr] gap-5'>
            <div data-aos="fade-right" className='flex flex-col gap-1'>
              <Image src={step_1} width={400} height={400} className='rounded-2xl' alt='login ilustration'></Image>
              <p className='text-[1.5rem] font-bold'>Log in</p>
              <p className='text-[1.1rem]'>Sign up, log in and start the experience.</p>
            </div>
            <div data-aos="fade-right" className='flex flex-col gap-1'>
              <Image src={step_2} width={400} height={400} className='rounded-2xl' alt='button ilustration'></Image>
              <p className='text-[1.5rem] font-bold'>Add your balance</p>
              <p className='text-[1.1rem]'>Add as much balance as you want to manage, with no limits.</p>
            </div>
            <div data-aos="fade-right" className='flex flex-col gap-1'>
              <Image src={step_3} width={400} height={400} className='rounded-2xl' alt='grafica ilustration'></Image>
              <p className='text-[1.5rem] font-bold'>Manage and ajust</p>
              <p className='text-[1.1rem]'>Review and manage your expenses.</p>
            </div>
          </div>
        </section>
        <section id="sectionSecurity" className='flex flex-col px-10 md:px-20 lg:px-30 py-10 bg-[rgb(5,50,0)] text-white gap-10'>
          <h2 className='text-[2.5rem] font-bold'>Security</h2>
          <div className='flex flex-col md:flex-row gap-10 justify-center md:justify-start'>
            <div className='flex flex-col items-center justify-center text-center gap-5'>
              <p className='text-[2rem] font-bold'>Your financial information is yours.</p>
              <Image data-aos="zoom-out" src={security} width={100} height={100} alt='shield ilustration'></Image>
            </div>
            <div className='flex flex-col'>
              <div data-aos="fade-up" className='flex items-center gap-5 border-y-1 border-white py-10'>
                <div>
                  <LuLockKeyhole size={40} />
                </div>
                <div>
                  <p className='text-lg font-semibold'>Encrypted end to end</p>
                  <p>Your financial data is encrypted in transit and at rest, so only you can access it.</p>
                </div>
              </div>
              <div data-aos="fade-up" className='flex items-center gap-5 border-y-1 border-white py-10'>
                <div>
                  <LuEyeOff size={40} />
                </div>
                <div>
                  <p className='text-lg font-semibold'>Your privacy comes first</p>
                  <p>We never sell or share your information with third parties. Your data stays yours.</p>
                </div>
              </div>
              <div data-aos="fade-up" className='flex items-center gap-5 border-y-1 border-white py-10'>
                <div>
                  <LuFileCheck size={40} />
                </div>
                <div>
                  <p className='text-lg font-semibold'>Secure and reliable backups</p>
                  <p>Strict access controls keep your records safe and always available.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="sectionPlans" className='flex flex-col px-10 md:px-20 lg:px-30 py-20 bg-[rgb(250,255,250)] gap-5'>
          <h2 className='text-[2.5rem] font-bold'>Plans</h2>
          <div className='flex flex-col xl:flex-row gap-10'>
            <div data-aos="flip-right" className='flex flex-col border-2 border-gray-500 rounded-xl py-3 px-10 gap-5 cursor-pointer hover:scale-105 hover:bg-gray-200 text-black'>
              <h3 className='text-[1.5rem] font-bold'>Plan basic (free)</h3>
              <div className='flex flex-col sm:flex-row items-center md:items-start gap-10'>
                <Image src={logo} width={200} height={200} alt='logo'></Image>
                <ul className='list-disc'>
                  <li>Unlimited accounts and balances</li>
                  <li>Full history, no month limit</li>
                  <li>Reports and charts</li>
                  <li>Export to Excel</li>
                  <li>Sync across devices</li>
                  <li className='text-gray-400'>Chatbot with unlimited conversation</li>
                  <li className='text-gray-400'>AI agents to automate your accounts.</li>
                  <li className='text-gray-400'>Priority support</li>
                </ul>
              </div>            
            </div>
            <div data-aos="flip-left" className='flex flex-col border-2 border-gray-500 rounded-xl py-3 px-10 gap-5 cursor-pointer 
              shadow-[0px_5px_20px_rgba(0,255,8,0.2),0px_-5px_20px_rgba(0,255,8,0.2)] 
              hover:scale-105 hover:shadow-[0px_5px_30px_rgba(0,255,8,0.2),0px_-5px_30px_rgba(0,255,8,0.2)]'>
              <h3 className='text-[1.5rem] font-bold'>Plan premium (100MXN monthly)</h3>
              <div className='flex flex-col sm:flex-row items-center md:items-start gap-10'>
                <Image src={logo_premium} width={200} height={200} alt='logo'></Image>
                <ul className='list-disc'>
                  <li>Unlimited accounts and balances</li>
                  <li>Full history, no month limit</li>
                  <li>Reports and charts</li>
                  <li>Export to Excel</li>
                  <li>Sync across devices</li>
                  <li className='text-blue-400'>Chatbot with unlimited conversation</li>
                  <li className='text-blue-400'>AI agents to automate your accounts.</li>
                  <li className='text-blue-400'>Priority support</li>
                </ul>
              </div>            
            </div>
          </div>          
        </section>
      </main>
      <footer className='grid grid-cols-[1fr_1fr] px-10 md:px-20 lg:px-30 py-20 bg-black text-white gap-10'>
        <p>Creator: Angel Reyes</p>
        <p>Contact: <a href='mailto:ar731684@gmail.com' className='text-blue-300 hover:underline'>ar731684@gmail.com</a></p>
        <p>To report  : </p>
      </footer>
    </>
    
  )
}
