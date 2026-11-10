"use client"

import { MdSupportAgent } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef, useEffectEvent } from "react";
import { FiSend } from "react-icons/fi";
import { Messages } from "@/app/schemas/schemas";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatAgent () {

    const [openChat, setOpenChat] = useState<boolean>(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);

    const lastMessage = useRef<HTMLDivElement>(null)

    useEffect(() => {

        const token = localStorage.getItem('token');

        lastMessage.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })

        async function getMessages () {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/agent/getMessages`, {
                    method: 'GET',
                    headers: {
                        'conetnt-type': 'application/json',
                        authorization: `Bearer ${token}`,
                    }
                })

                const data = await response.json()
                console.log("MESSAGES: ", data)

                if (response.status != 200) {
                    console.log("Error to get messages front.")
                }

                setMessages(data)                

            } catch (error) {
                console.log("Error in getMessages", error)
            }
        }

        getMessages();

    }, [])

    useEffect(() => {

        lastMessage.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        })

    }, [messages])

    async function postMessage () {
        const token = localStorage.getItem("token");

        const message = inputMessage
        let id = Date.now();

        setInputMessage("")
        setMessages([...messages, {"id": id, "role": "user", "message": message}])        

        try {

            setThinking(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/agent/postMessage`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message,
                })
            })

            const data = await response.json()

            if (response.status != 200) {
                console.log("Error to post message: ", data.detail)   
            }

            console.log("MESSAGE POST: ", data)

            setMessages(prev => [...prev, data])

        } catch (error) {
            console.log("Error in postMessages", error)
        } finally {
            setThinking(false)
        }
    }

    return (
        <>
            <div className="fixed right-10 bottom-10">
                <div className={"relative flex justify-start bg-white w-[400px] h-[600px]" + (openChat ? ' flex ' : ' hidden ')}>
                    <div className="overflow-y-scroll">
                        <div className="absolute flex items-center justify-start w-full bg-[rgb(0,200,0)] text-white p-2 font-semibold text-[1.1rem] gap-2">
                            <h2>Agent support</h2>
                            <MdSupportAgent size={25} />
                        </div>                        
                        <div className="flex flex-col px-2 pt-15 pb-20 bg-[rgb(0,30,0)] gap-4">
                            {messages?.map(message => message.role === "user" ? 
                            (
                                <div key={message?.id} className="flex justify-end">
                                    <p className="p-2 bg-[rgb(0,200,0)] w-auto max-w-[80%] rounded-md text-white">{message.message}</p>
                                </div>
                            ) : (
                                <div key={message?.id} className="p-2 bg-gray-300 w-[80%] rounded-md">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} >{message.message}</ReactMarkdown>
                                </div>
                            ))}              
                            {thinking ? <p className="p-2 bg-gray-300 w-[30%] rounded-md">Thinking...</p> : null}                                                                                                  
                        </div>                        
                        <div ref={lastMessage} />
                    </div>
                    <div className="absolute bottom-0 flex items-center justify-between w-[96%] h-auto bg-gray-300 p-1">
                        <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Write..." className="focus:outline-0 w-[80%] min-h-[70px] max-h-[80px] p-2"></textarea>
                        <button onClick={() => postMessage()} className="flex items-center justify-end p-3 rounded-3xl bg-[rgb(0,200,0)] cursor-pointer text-white active:scale-95">
                            <FiSend size={30} className="w-fit"/>
                        </button>
                    </div>
                </div> 
                <div className="flex justify-end">
                    <button onClick={() => setOpenChat(!openChat)} className="bg-[rgb(0,200,0)] text-white cursor-pointer px-3 py-3 rounded-4xl active:scale-95">   
                        {openChat ? <FaPlus size={50} className="rotate-45"/> : <MdSupportAgent size={50} />}
                    </button>
                </div>               
                
            </div>
            
        </>
    )
}