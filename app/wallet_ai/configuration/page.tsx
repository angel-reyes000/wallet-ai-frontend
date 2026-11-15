"use client"

import { MdPerson, MdColorLens, MdAutoAwesome, MdSecurity, MdInfoOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { dataUser, AppConfiguration } from "@/app/schemas/schemas";

const textSecurityPrivacity = `
Your data is not used neither published in any place
your data is storaged sure.
`

const textAboutOf = `
This application was created with the propuse of learning and practice with AI tools 
and the technologies used was Next.js, FastAPI, LangChain, LangGraph, JWT, bcrypt, PostgreSQL
and deployed in vercel and railway.
`

export default function Configuration () {
    const [dataUser, setDataUser] = useState<dataUser>();
    const [backgroundColor, setBackgroundColor] = useState<boolean>(false);
    const [temperature, setTemperature] = useState<number>(0.5);

    useEffect(() => {

        const token = localStorage.getItem('token')

        async function getDataUserConfig () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/getDataUser`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`,
                    }
                })

                const data = await response.json()

                if (response.status != 200) {
                    console.log("Error in getDataUserConfig...")
                }

                setDataUser(data)
                //console.log(data)

            } catch (error) {
                console.log("Error in getDataUserConfig: ", error)
            }
        }

        getDataUserConfig();

    }, [])

    return (
        <>
            <div className="min-w-0 flex-1 p-5 pb-40 text-white sm:p-8 sm:pb-40 lg:p-10 lg:pb-40">
                <div className="mb-6">
                    <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Configuration</h1>
                </div>
                <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    <div className="app-card flex flex-col gap-4">
                        <p className='flex flex-row items-center gap-3 text-lg font-bold'><span className="flex rounded-xl bg-green-700/30 p-2 text-green-300"><MdPerson size={24} /></span>Account</p>
                        <div className="flex flex-wrap gap-x-10 gap-y-3">
                            <div className="min-w-0">
                                <p className='text-sm font-semibold text-green-100/70'>Username:</p>
                                <p>{dataUser?.username}</p>
                            </div>
                            <div className="min-w-0">
                                <p className='text-sm font-semibold text-green-100/70'>Email:</p>
                                <p className="break-all">{dataUser?.email}</p>
                            </div>
                            <div className="min-w-0">
                                <p className='text-sm font-semibold text-green-100/70'>Created at:</p>
                                <p>{dataUser?.created_at}</p>
                            </div>
                        </div>

                    </div>
                    <div className="app-card flex flex-col gap-4">
                        <p className='flex flex-row items-center gap-3 text-lg font-bold'><span className="flex rounded-xl bg-green-700/30 p-2 text-green-300"><MdColorLens size={24} /></span>Appearance</p>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-semibold text-green-100/70'>Color background:</p>
                            <label className='flex items-center gap-2'>
                                White:
                                <input type="checkbox" className="h-4 w-4 cursor-pointer accent-green-600"></input>
                            </label>
                            <p className="text-[0.8rem] text-green-100/60">Cambia a tema claro u oscuro.</p>
                        </div>
                    </div>
                    <div className="app-card flex flex-col gap-4">
                        <p className='flex flex-row items-center gap-3 text-lg font-bold'><span className="flex rounded-xl bg-green-700/30 p-2 text-green-300"><MdAutoAwesome size={24} /></span>AI config</p>
                        <div>
                            <label className='flex flex-col gap-2 font-semibold'>
                                <div className="flex w-full justify-between">
                                    Temperature:
                                    <p className="text-green-300">{temperature}</p>
                                </div>
                                <input value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} type="range" min="0" max="1" step="0.1" className="w-full cursor-pointer accent-green-500"></input>
                                <p className="text-[0.8rem] font-normal text-green-100/60">Mide el nivel de precision de cada respuesta de tu agente de IA donde 0 es mas especifico y 1 mas alusinado.</p>
                            </label>
                        </div>
                    </div>
                    <div className="app-card flex flex-col gap-4">
                        <p className='flex flex-row items-center gap-3 text-lg font-bold'><span className="flex rounded-xl bg-green-700/30 p-2 text-green-300"><MdSecurity size={24} /></span>Security and privacity</p>
                        <div>
                            <p className='text-sm font-semibold text-green-100/70'>Security and privacity:</p>
                            <p className="text-[0.9rem] text-green-100/60">{textSecurityPrivacity}</p>
                        </div>
                    </div>
                    <div className="app-card flex flex-col gap-4">
                        <p className='flex flex-row items-center gap-3 text-lg font-bold'><span className="flex rounded-xl bg-green-700/30 p-2 text-green-300"><MdInfoOutline size={24} /></span>About of</p>
                        <div>
                            <p className='text-sm font-semibold text-green-100/70'>About of:</p>
                            <p className="text-[0.9rem] text-green-100/60">{textAboutOf}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
