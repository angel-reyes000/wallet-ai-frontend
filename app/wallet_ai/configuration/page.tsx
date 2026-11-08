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
            <div className="flex flex-wrap content-start justify-start text-white p-10 gap-2">
                <div className="flex flex-col bg-[rgb(0,15,0)] w-[500px] h-[200px] p-5 rounded-lg gap-2">
                    <p className='flex flex-row items-center text-[1.2rem] font-bold gap-2'><MdPerson size={30} />Account</p>
                    <div className="flex flex-wrap gap-x-20">
                        <div>
                            <p className='font-semibold'>Username:</p>
                            <p>{dataUser?.username}</p>
                        </div>
                        <div>
                            <p className='font-semibold'>Email:</p>
                            <p>{dataUser?.email}</p>
                        </div>
                        <div>
                            <p className='font-semibold'>Created at:</p>
                            <p>{dataUser?.created_at}</p>
                        </div>
                    </div>
                    
                </div>
                <div className="flex flex-col bg-[rgb(0,15,0)] w-[500px] h-[200px] p-5 rounded-lg gap-2">
                    <p className='flex flex-row items-center text-[1.2rem] font-bold gap-2'><MdColorLens size={30} />Appearance</p>
                    <div className="flex flex-col gap-2">
                        <p className='font-semibold'>Color background:</p>
                        <label className='flex gap-2'>
                            White:
                            <input type="checkbox" className="cursor-pointer"></input>
                        </label>
                        <p className="text-[0.8rem] text-gray-300">Cambia a tema claro u oscuro.</p>
                    </div>
                </div>
                <div className="flex flex-col bg-[rgb(0,15,0)] w-[500px] h-[200px] p-5 rounded-lg gap-2">
                    <p className='flex flex-row items-center text-[1.2rem] font-bold gap-2'><MdAutoAwesome size={30} />AI config</p>
                    <div>
                        <label className='flex flex-col font-semibold gap-1'>
                            <div className="flex justify-between w-full">
                                Temperature:
                                <p>{temperature}</p>
                            </div>                                                        
                            <input value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} type="range" min="0" max="1" step="0.1" className="cursor-pointer"></input>
                            <p className="text-[0.8rem] text-gray-300">Mide el nivel de precision de cada respuesta de tu agente de IA donde 0 es mas especifico y 1 mas alusinado.</p>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col bg-[rgb(0,15,0)] w-[500px] h-[200px] p-5 rounded-lg gap-2">
                    <p className='flex flex-row items-center text-[1.2rem] font-bold gap-2'><MdSecurity size={30} />Security and privacity</p>
                    <div>
                        <p className='font-semibold'>Security and privacity:</p>
                        <p className="text-[0.9rem] text-gray-400">{textSecurityPrivacity}</p>
                    </div>
                </div>
                <div className="flex flex-col bg-[rgb(0,15,0)] w-[500px] h-[200px] p-5 rounded-lg gap-2">
                    <p className='flex flex-row items-center text-[1.2rem] font-bold gap-2'><MdInfoOutline size={30} />About of</p>
                    <div>
                        <p className='font-semibold'>About of:</p>
                        <p className="text-[0.9rem] text-gray-400">{textAboutOf}</p>
                    </div>
                </div>
            </div>
        </>
    )
}