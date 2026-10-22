"use client"

import { MdSupportAgent } from "react-icons/md"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import { FiSend } from "react-icons/fi" 

export default function ChatAgent () {
    const [openChat, setOpenChat] = useState<boolean>(false);

    return (
        <>
            <div className="fixed right-10 bottom-10">
                <div className={"relative flex justify-center bg-white w-[400px] h-[600px]" + (openChat ? ' flex ' : ' hidden ')}>
                    <div className="w-full overflow-y-scroll">
                        <div className="absolute flex items-center justify-start w-full bg-green-900 text-white p-2 font-semibold text-[1.1rem] gap-2">
                            <h2>Agent support</h2>
                            <MdSupportAgent size={25} />
                        </div>                        
                        <div className="flex flex-col px-2 pt-15 pb-20 gap-4">
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="p-2 bg-gray-300 w-[80%] rounded-md">Mensaje largo de chatbot para personalizarlo.</p>
                            </div>
                            <div className="flex justify-end">
                                <p className="p-2 bg-gray-200 w-[80%] rounded-md bg-green-900 text-white">Mensaje largo de humano para personalizarlo.</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 flex items-center justify-between border-2 w-full max-h-[70px] bg-white p-1">
                        <input placeholder="Write..." className="focus:outline-0 w-[75%] p-2"></input>
                        <div className="flex items-center justify-end p-3 rounded-3xl bg-green-900 text-white active:scale-95">
                            <FiSend size={30} className="cursor-pointer w-fit"/>
                        </div>
                    </div>
                </div> 
                <div className="flex justify-end">
                    <button onClick={() => setOpenChat(!openChat)} className="bg-green-900 text-white cursor-pointer px-3 py-3 rounded-4xl active:scale-95">   
                        {openChat ? <FaPlus size={50} className="rotate-45"/> : <MdSupportAgent size={50} />}
                    </button>
                </div>               
                
            </div>
            
        </>
    )
}