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
import { LuLockKeyhole, LuEyeOff, LuFileCheck, LuMenu, LuLock } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import { useState, useRef } from 'react'; 
import { useRouter } from 'next/navigation'; 

export default function Home () {

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [stateToken, setStateToken] = useState<boolean>(false);

  const refModal = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  function scrollIntoViewPersonality (section: string) {
    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  function closeModal (pathLogin: boolean) {
    if (pathLogin) {
      refModal.current!.style.display = 'none';
      refModal.current?.close()
      router.push('/login')
    } else {
      refModal.current!.style.display = 'none';
      refModal.current?.close()
    }
  }

  function showModal() {
    if (!stateToken) {
      refModal.current!.close();
      refModal.current!.style.display = 'flex';
      refModal.current?.showModal();
    } else {
      router.push("/wallet_ai");
    }
  }

  useEffect(() => {

    refModal.current!.style.display = 'none';

    AOS.init({
      duration: 1000, 
      delay: 0,
      once: false,
    })

    const token = localStorage.getItem('token');

    async function getDataUser () {

      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/getDataUser`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json'
          },
        })

        const data = await response.json();

        if (response.status != 200 || data.message) {
          setStateToken(false);
          console.log(data.message)
          return
        }

        console.log(data)

        setStateToken(true);

      } catch (error) {
        console.log("Error in getDataUser: ", error)
      }
    }

    getDataUser();

  }, [stateToken])

  const navLink = 'cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
  const mobileNavLink = 'w-full cursor-pointer rounded-lg px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

  return (
    <>
      <dialog ref={refModal} className='m-auto flex w-[90%] max-w-md flex-col items-center gap-6 rounded-2xl p-8 text-center shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm'>
          <div className='flex w-fit rounded-2xl bg-brand p-4 text-white shadow-lg shadow-green-900/20'>
              <LuLock size={44} />
          </div>
          <div className='flex flex-col gap-2'>
              <p className='text-2xl font-bold text-gray-900'>Log in to continue.</p>
              <p className='text-base leading-relaxed text-gray-600'>For you security we closed your session, log in to continue manage your finances.</p>
          </div>
          <div className='flex w-full flex-col-reverse gap-3 sm:flex-row'>
              <button onClick={() => closeModal(false)} className='w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-base font-semibold text-gray-700 transition duration-200 hover:bg-gray-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-1/2'>Cancel</button>
              <button onClick={() => closeModal(true)} className='w-full cursor-pointer rounded-lg bg-brand px-4 py-2.5 text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-brand-dark active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-1/2'>Log in</button>
          </div>
      </dialog>
      {/*--------------------------------------------------ORIGINAL MENU----------------------------------------------------*/}
      <header className='fixed top-0 z-10 w-full border-b border-green-900/10 bg-white/85 backdrop-blur-md'>
        <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-10'>
          <div onClick={() => scrollIntoViewPersonality("mainSection")} className='flex cursor-pointer items-center gap-2'>
            <Image src={logo} width={40} height={40} alt='logo'></Image>
            <p className='flex text-[1.5rem] font-bold text-gray-900'>Wallet-<span className='bg-linear-to-t from-green-800 to-green-500 bg-clip-text text-transparent'>AI</span></p>
          </div>
          <div className='hidden items-center gap-2 md:flex lg:gap-4'>
            <button type='button' onClick={() => scrollIntoViewPersonality("sectionWork")} className={navLink}>How does it work</button>
            <button type='button' onClick={() => scrollIntoViewPersonality("sectionSecurity")} className={navLink}>Security</button>
            <button onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }} className='ml-2 cursor-pointer rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-brand-dark active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'>{stateToken ? 'Log out' : 'Log in'}</button>
          </div>
          <button type='button' aria-label={openMenu ? 'Close menu' : 'Open menu'} aria-expanded={openMenu} onClick={() => setOpenMenu(!openMenu)} className='flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-800 transition-colors hover:bg-brand-soft md:hidden'>
            {openMenu ? (
              <FaPlus size={28} className='rotate-45' />
            ):(
              <LuMenu size={28} />
            )}
          </button>
        </div>
        {openMenu && (
          <div className='flex flex-col gap-1 border-t border-green-900/10 bg-white px-6 py-3 shadow-lg md:hidden'>
            <button type='button' onClick={() => scrollIntoViewPersonality("sectionWork")} className={mobileNavLink}>How does it work</button>
            <button type='button' onClick={() => scrollIntoViewPersonality("sectionSecurity")} className={mobileNavLink}>Security</button>
          </div>
        )}
      </header>
      {/*--------------------------------------------------MENU FAKE (spacer)----------------------------------------------------*/}
      <div aria-hidden='true' className='h-16 w-full bg-white' />
      <main className='h-auto bg-white text-gray-900'>
        <section id='mainSection' className='relative overflow-hidden bg-[url(@/public/images-home/fondo-cuadriculado.png)]'>
          <div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-linear-to-b from-white/80 via-white/60 to-green-50' />
          <div className='relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24'>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col gap-5'>
                <h1 className='text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl'>Knows <span className='bg-linear-to-r from-brand to-green-500 bg-clip-text text-transparent'>where your money goes</span> before it&apos;s gone</h1>
                <p className='max-w-xl text-lg leading-relaxed text-gray-600'>Gather your accounts and see how much you have left at the end of the month.</p>
              </div>
              <div className='flex justify-center md:justify-start'>
                <button onClick={() => showModal()}  data-aos="zoom-in" className='w-full cursor-pointer rounded-xl bg-brand px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-green-900/25 transition duration-200 hover:bg-brand-dark hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'>Start...</button>
              </div>
            </div>
            <Image data-aos="zoom-out" className='mx-auto h-auto w-full max-w-xl rounded-2xl bg-white p-1 shadow-xl shadow-green-900/10 ring-1 ring-green-900/10' src={grafica} width={700} height={700} alt='grafica'></Image>
          </div>
        </section>
        <section id="sectionWork" className='bg-brand-soft'>
          <div className='mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 md:px-10 md:py-24'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>¿How does it work?</h2>
              <span aria-hidden='true' className='h-1 w-16 rounded-full bg-brand' />
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              <div data-aos="fade-right" className='flex flex-col gap-3 rounded-2xl border border-green-900/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0'>
                <Image src={step_1} width={400} height={400} className='h-auto w-full rounded-xl' alt='login ilustration'></Image>
                <div className='flex flex-col gap-1 px-1 pb-1'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'>1</span>
                  <p className='mt-2 text-xl font-bold'>Log in</p>
                  <p className='leading-relaxed text-gray-600'>Sign up, log in and start the experience.</p>
                </div>
              </div>
              <div data-aos="fade-right" className='flex flex-col gap-3 rounded-2xl border border-green-900/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0'>
                <Image src={step_2} width={400} height={400} className='h-auto w-full rounded-xl' alt='button ilustration'></Image>
                <div className='flex flex-col gap-1 px-1 pb-1'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'>2</span>
                  <p className='mt-2 text-xl font-bold'>Add your balance</p>
                  <p className='leading-relaxed text-gray-600'>Add as much balance as you want to manage, with no limits.</p>
                </div>
              </div>
              <div data-aos="fade-right" className='flex flex-col gap-3 rounded-2xl border border-green-900/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0'>
                <Image src={step_3} width={400} height={400} className='h-auto w-full rounded-xl' alt='grafic ilustration'></Image>
                <div className='flex flex-col gap-1 px-1 pb-1'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'>3</span>
                  <p className='mt-2 text-xl font-bold'>Manage and ajust</p>
                  <p className='leading-relaxed text-gray-600'>Review and manage your expenses.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="sectionSecurity" className='relative overflow-hidden bg-brand-deep text-white'>
          <div aria-hidden='true' className='pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-green-500/15 blur-3xl' />
          <div className='relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 md:px-10 md:py-24'>
            <div className='flex flex-col gap-3'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Security</h2>
              <span aria-hidden='true' className='h-1 w-16 rounded-full bg-green-400' />
            </div>
            <div className='grid items-center gap-12 md:grid-cols-2'>
              <div className='flex flex-col items-center justify-center gap-6 text-center'>
                <p className='text-2xl font-bold leading-snug sm:text-3xl'>Your financial information is yours.</p>
                <Image data-aos="zoom-out" src={security} width={100} height={100} alt='shield ilustration'></Image>
              </div>
              <div className='flex flex-col gap-4'>
                <div data-aos="fade-up" className='flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10'>
                  <div className='flex shrink-0 rounded-xl bg-green-400/15 p-3 text-green-300'>
                    <LuLockKeyhole size={28} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Encrypted end to end</p>
                    <p className='leading-relaxed text-green-50/80'>Your financial data is encrypted in transit and at rest, so only you can access it.</p>
                  </div>
                </div>
                <div data-aos="fade-up" className='flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10'>
                  <div className='flex shrink-0 rounded-xl bg-green-400/15 p-3 text-green-300'>
                    <LuEyeOff size={28} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Your privacy comes first</p>
                    <p className='leading-relaxed text-green-50/80'>We never sell or share your information with third parties. Your data stays yours.</p>
                  </div>
                </div>
                <div data-aos="fade-up" className='flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10'>
                  <div className='flex shrink-0 rounded-xl bg-green-400/15 p-3 text-green-300'>
                    <LuFileCheck size={28} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Secure and reliable backups</p>
                    <p className='leading-relaxed text-green-50/80'>Strict access controls keep your records safe and always available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='bg-gray-950 text-gray-300'>
        <div className='mx-auto grid w-full max-w-7xl gap-4 px-6 py-12 text-sm md:grid-cols-3 md:px-10'>
          <p>Creator: Angel Reyes</p>
          <p>Contact: <a href='mailto:ar731684@gmail.com' className='text-green-400 underline-offset-4 transition-colors hover:text-green-300 hover:underline'>ar731684@gmail.com</a></p>
          <p>To report  : </p>
        </div>
      </footer>
    </>

  )
}
