"use client"

import { MdSupportAgent } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef, useEffectEvent } from "react";
import { FiSend } from "react-icons/fi";
import { Messages } from "@/app/schemas/schemas";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../styles/styles.css';
import { validateChatMessage, apiErrorMessage, MAX_CHAT_MESSAGE } from '@/app/schemas/validation';

export default function ChatAgent () {

    const [openChat, setOpenChat] = useState<boolean>(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [chatError, setChatError] = useState<string>("");
    const [sending, setSending] = useState<boolean>(false);

    const lastMessage = useRef<HTMLDivElement>(null)
    const refTextArea = useRef<HTMLDivElement>(null)

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

                setMessages(Array.isArray(data) ? data : [])                

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

        // Validate first: nothing is sent while a reply is still being written or the text is invalid.
        const invalid = validateChatMessage(inputMessage);

        if (sending) return;

        if (invalid) {
            setChatError(invalid);
            return
        }

        setChatError("");
        setSending(true);

        const message = inputMessage.trim()
        let id = Date.now();

        setInputMessage("")
        setMessages([...messages, {"id": id, "role": "user", "message": message}])        

        try {

            setThinking(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/agent/postMessageStream`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message,
                })
            })

            if (response.status != 200 || !response.body) {
                const data = await response.json().catch(() => null)
                console.log("Error to post message: ", data?.detail)
                setChatError(apiErrorMessage(data, "The agent could not answer, try again."))
                return
            }

            // The reply arrives as Server-Sent Events: {"token"} per token, then {"done", "message"}.
            const replyId = id + 1;
            let reply = "";
            let started = false;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const events = buffer.split("\n\n");
                buffer = events.pop() ?? "";

                for (const rawEvent of events) {
                    const line = rawEvent.trim();

                    if (!line.startsWith("data:")) continue;

                    const data = JSON.parse(line.slice(5).trim());

                    if (data.error) {
                        console.log("Error to post message: ", data.error)
                        setChatError(String(data.error))
                    } else if (data.token) {
                        reply += data.token;

                        if (!started) {
                            started = true;
                            setThinking(false);
                            setMessages(prev => [...prev, {"id": replyId, "role": "ai", "message": reply}])
                        } else {
                            setMessages(prev => prev.map(obj => obj.id === replyId ? {...obj, "message": reply} : obj))
                        }
                    } else if (data.done) {
                        // Replace the streamed text with the saved message (keeps the same key, no remount).
                        const saved = {...data.message, "id": replyId};
                        setMessages(prev => started ? prev.map(obj => obj.id === replyId ? saved : obj) : [...prev, saved])
                    }
                }
            }

        } catch (error) {
            console.log("Error in postMessages", error)
            setChatError("Could not reach the server, try again.")
        } finally {
            setThinking(false)
            setSending(false)
        }
    }

    return (
        <>
            <div className="fixed right-4 bottom-4 z-20 sm:right-10 sm:bottom-10">
                <div className={"relative mb-3 h-[70dvh] max-h-[600px] w-[calc(100vw-2rem)] max-w-[400px] justify-start overflow-hidden rounded-2xl border border-white/10 bg-app-surface shadow-2xl shadow-black/50" + (openChat ? ' flex ' : ' hidden ')}>
                    <div className="w-full overflow-y-auto bg-app-bg pb-10">
                        <div className="absolute z-10 flex w-full items-center justify-start gap-2 bg-green-800 px-4 py-3 text-[1.05rem] font-semibold text-white shadow-md">
                            <h2>Agent support</h2>
                            <MdSupportAgent size={25} />
                        </div>                        
                        <div className="flex w-full flex-col gap-4 px-3 pt-16 pb-24">
                            {messages.map(message => message.role === "user" ? 
                            (
                                <div key={message?.id} className="flex justify-end">
                                    <p className="w-auto max-w-[80%] rounded-2xl rounded-br-sm bg-green-700 px-3 py-2 text-white">{message.message}</p>
                                </div>
                            ) : (
                                <div key={message?.id} className="w-[85%] rounded-2xl rounded-bl-sm bg-green-50 px-3 py-2 text-gray-900">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} >{message.message}</ReactMarkdown>
                                </div>
                            ))}              
                            {thinking ? <p className="w-fit rounded-2xl rounded-bl-sm bg-green-50 px-3 py-2 font-semibold text-gray-900">
                                Thinking
                                <span className="move_dots">.</span>
                                <span className="move_dots">.</span>
                                <span className="move_dots">.</span>
                            </p> : null}                                                                                                                          
                        </div>                        
                        <div ref={lastMessage} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex h-auto w-full items-center justify-between gap-2 border-t border-white/10 bg-app-surface p-2">
                        {(chatError || inputMessage.length > MAX_CHAT_MESSAGE - 200) && (
                            <p role="alert" className={"absolute inset-x-0 bottom-full bg-app-surface/95 px-3 py-1 text-xs font-medium " + (chatError ? "text-red-400" : "text-green-100/70")}>
                                {chatError || inputMessage.length + "/" + MAX_CHAT_MESSAGE}
                            </p>
                        )}
                        <textarea value={inputMessage} maxLength={MAX_CHAT_MESSAGE} onChange={(e) => { setInputMessage(e.target.value); setChatError("") }} onKeyDown={(e) => {
                            // Enter sends the message; Shift+Enter inserts a new line (IME composition is ignored).
                            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                                e.preventDefault();
                                if (inputMessage.trim().length > 0 && !sending) postMessage();
                            }
                        }} placeholder="Write..." className="app-field min-h-[56px] max-h-[80px] flex-1 resize-none"></textarea>
                        <button onClick={() => postMessage()} disabled={sending || inputMessage.trim().length === 0} aria-label="Send message" className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-700 p-3 text-white transition duration-200 hover:bg-green-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-not-allowed disabled:opacity-50">
                            <FiSend size={22} className="w-fit"/>
                        </button>
                    </div>
                </div> 
                <div className="flex justify-end">
                    <button onClick={() => setOpenChat(!openChat)} aria-label={openChat ? "Close chat" : "Open chat"} className="cursor-pointer rounded-full bg-green-700 p-3.5 text-white shadow-lg shadow-black/40 transition duration-200 hover:bg-green-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400">   
                        {openChat ? <FaPlus size={36} className="rotate-45"/> : <MdSupportAgent size={36} />}
                    </button>
                </div>               
                
            </div>
            
        </>
    )
}