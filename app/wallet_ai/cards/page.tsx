"use client"

import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/app/schemas/schemas";

export default function Cards () {
    const [openModalAddCard, setOpenModalAddCard] = useState<boolean>(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [dataCard, setDataCard] = useState<Card>({
        id: 0,
        name: "",
        type: "",
        last_numbers: "",
        background_color: "white",
        color: "black",
        expired_date: "",
        created_at: "",
    });

    const refModalAddCard = useRef<HTMLDialogElement>(null);

    useEffect(() => {

        refModalAddCard.current!.style.display = 'none';

        const token = localStorage.getItem("token");

        async function getCards () {
            try {
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/getCards`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Error to get cards.")
                }

                setCards(data);
                console.log(data);

            } catch (error) {
                console.log("Error in getCards: ", error)
            }
        }

        getCards();

    }, [])

    async function getCards () {

        const token = localStorage.getItem('token')

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/getCards`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();

            if (response.status != 200) {
                console.log("Error to get cards.")
            }

            setCards(data);
            console.log(data);

        } catch (error) {
            console.log("Error in getCards: ", error)
        }
    }

    async function postCard () {

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/postCard`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: dataCard.name, 
                    type: dataCard.type, 
                    last_numbers: dataCard.last_numbers,
                    expired_date: dataCard.expired_date,
                    background_color: dataCard.background_color,
                    color: dataCard.color,
                })
            })

            const data = await response.json()

            if (response.status != 200) {
                console.log("Error post card: ", data.detail)
                return
            }

            console.log(data)
            setCards(prev => [...prev, data])
            refModalAddCard.current?.close()
            refModalAddCard.current!.style.display = 'none';

        } catch (error) {
            console.log("Error in postCard: ", error)
        }
    }

    async function updateCard () {

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/updateCard`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: dataCard.name, 
                    type: dataCard.type, 
                    last_numbers: dataCard.last_numbers,
                    expired_date: dataCard.expired_date?.slice(0,7),
                    background_color: dataCard.background_color,
                    color: dataCard.color,
                    id: dataCard.id,
                })
            })

            const data = await response.json()

            if (response.status != 200) {
                console.log("Error update card: ", data.detail)
            }

            console.log(data)
            getCards();
            setDataCard({
                id: 0,
                name: "",
                type: "",
                last_numbers: "",
                background_color: "",
                color: "",
                expired_date: "",
                created_at: "",
            })

        } catch (error) {
            console.log("Error in updateCard: ", error)
        }
    }

    return (
        <>  
            <dialog ref={refModalAddCard} className="flex flex-col m-auto p-5 bg-[rgb(0,30,0)] rounded-md text-white gap-5">
                <div className="flex justify-between">
                    <h1 className="font-bold text-[1.5rem]">Add Card</h1>
                    <button onClick={() => {
                        refModalAddCard.current?.close()
                        refModalAddCard.current!.style.display = 'none';
                    }} className="cursor-pointer rotate-45 active-scale-95"><FaPlus size={25} /></button>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col justify-between p-5 h-[200px] w-[400px] rounded-xl gap-5" style={{backgroundColor: `${dataCard.background_color}`, color: `${dataCard.color}`}}>
                        <div className="flex justify-between gap-5">
                            <label className="flex font-semibold text-[1.1rem] gap-1">
                                <span>Name: </span>
                                <input value={dataCard.name} onChange={(e) => setDataCard({...dataCard, name: e.target.value})} className="w-[80%] focus:outline-0 border-b-1"></input>
                            </label>
                            <label className="flex font-semibold text-[1.1rem] gap-1">
                                <span>Type:</span>
                                <select value={dataCard.type} onChange={(e) => setDataCard({...dataCard, type: e.target.value})}>
                                    <option>Credit</option>
                                    <option>Debit</option>
                                </select>
                            </label>
                        </div>
                        <label className="font-semibold text-[1.1rem] w-[80%]">
                            Last four digits: *******************
                            <input value={dataCard.last_numbers} onChange={(e) => setDataCard({...dataCard, last_numbers: e.target.value})} className="w-[20%]"></input>
                        </label>
                        <div className="flex justify-between items-center">   
                            <label>
                                <span className="font-semibold">CVV: ***</span>
                            </label>
                            <label className="font-semibold">
                                <span >Vence: </span>
                                <input value={dataCard.expired_date} onChange={(e) => setDataCard({...dataCard, expired_date: e.target.value})} type="month"></input>
                            </label>      
                        </div>
                    </div>  
                    <div className="flex justify-between">
                        <label className="flex items-center">
                            Background color: 
                            <input value={dataCard.background_color} onChange={(e) => setDataCard({...dataCard, background_color: e.target.value})} type="color"></input>
                        </label>
                        <label >
                            Color:
                            <input value={dataCard.color} onChange={(e) => setDataCard({...dataCard, color: e.target.value})} type="color"></input>
                        </label>
                    </div>                    
                </div>    
                <div className="flex justify-end gap-5">
                    <button onClick={() => postCard()} className="p-1 bg-[rgb(0,200,0)] w-[100px] cursor-pointer active:scale-95">Save</button>
                    <button onClick={() => {
                        refModalAddCard.current?.close()
                        refModalAddCard.current!.style.display = 'none';
                    }} className="p-1 border-1 w-[100px] cursor-pointer active:scale-95">Cancel</button>
                </div>            
            </dialog>
            <div className="flex flex-col p-10 pb-50 text-white w-full gap-2">
                <div className="flex justify-between items-center pb-5 gap-5">
                    <div>
                        <h1 className='font-bold text-4xl'>Cards</h1>
                        <p>Analize visually your cards</p> 
                    </div>
                    <button onClick={() => {
                        refModalAddCard.current?.showModal()
                        refModalAddCard.current!.style.display = 'flex';
                        setDataCard({
                            id: 0,
                            name: "",
                            type: "",
                            last_numbers: "",
                            background_color: "white",
                            color: "black",
                            expired_date: "",
                            created_at: "",
                        })
                    }} className="flex items-center justify-center rounded-sm bg-[rgb(0,200,0)] h-fit w-[150px] p-1 font-semibold text-[1.1rem] cursor-pointer active:scale-95 gap-2"><FaPlus size={20}/> Add card</button>
                </div>
                {cards.sort((a, b) => a.expired_date?.localeCompare(b?.expired_date)).map(card => card.id !== dataCard.id ? (
                    <div key={card.id} className="flex flex-wrap gap-5">
                        <div className="flex flex-col items-center lg:items-start lg:flex-row bg-[rgb(0,15,0)] w-full rounded-md p-5 gap-5">
                            <div className="flex flex-col justify-between p-5 h-[200px] min-w-[300px] max-w-[300px] sm:min-w-[380px] sm:max-w-[380px] rounded-xl gap-5" style={{backgroundColor: `${card.background_color}`, color: `${card.color}`}}>
                                <div className="flex justify-between">
                                    <p className="font-semibold text-[1.1rem]">{card.name}</p>
                                    <p className="font-semibold text-[1.1rem]">{card.type}</p>
                                </div>
                                <p className="font-semibold text-[1.1rem] w-full">*******************{card.last_numbers}</p>
                                <div className="flex justify-between items-center">    
                                    <p className="font-semibold">CVV: ***</p>                        
                                    <p className="font-semibold">Vence: {card.expired_date?.slice(0,7)}</p>
                                </div>
                            </div>                         
                            <div className="flex flex-col w-full gap-5">
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-[1.2rem]">Details</h2>
                                    <button onClick={() => setDataCard(card)} className="bg-[rgb(0,200,0)] p-2 cursor-pointer active:scale-95">Edit card</button>
                                </div>
                                <div className="flex flex-wrap gap-10">
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Name card:</span>
                                        <p>{card.name}</p>
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Type:</span>
                                        <p>{card.type}</p>  
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">last_Numbers:</span>
                                        <p>{card.last_numbers}</p>
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Expired date:</span>
                                        <p>{card.expired_date?.slice(0,7)}</p>
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Background color:</span>
                                        <p>{card.background_color}</p>  
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Color:</span>
                                        <p>{card.color}</p>  
                                    </label>
                                </div>
                            </div>                                            
                        </div>                    
                    </div>
                ) : (
                    <div key={card.id} className="flex flex-wrap gap-5">
                        <div className="flex flex-col items-center lg:items-start lg:flex-row bg-[rgb(0,15,0)] w-full rounded-md p-5 gap-5">
                            <div className="flex flex-col justify-between p-5 h-[200px] min-w-[300px] max-w-[300px] sm:min-w-[380px] sm:max-w-[380px] rounded-xl gap-5" style={{backgroundColor: `${dataCard.background_color}`,  color: `${dataCard.color}`}}>
                                <div className="flex justify-between">
                                    <p className="font-semibold text-[1.1rem]">{dataCard.name}</p>
                                    <p className="font-semibold text-[1.1rem]">{dataCard.type}</p>
                                </div>
                                <p className="font-semibold text-[1.1rem] w-full">*******************{dataCard.last_numbers}</p>
                                <div className="flex justify-between items-center">    
                                    <p className="font-semibold">CVV: ***</p>                        
                                    <p className="font-semibold">Vence: {dataCard.expired_date?.slice(0,7)}</p>
                                </div>
                            </div>                         
                            <div className="flex flex-col w-full gap-5">
                                <div className="flex justify-between">
                                    <h2 className="font-semibold text-[1.2rem]">Details</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => updateCard()} className="bg-[rgb(0,200,0)] p-2 cursor-pointer active:scale-95">Save</button>
                                        <button onClick={() => setDataCard({
                                            id: 0,
                                            name: "",
                                            type: "",
                                            last_numbers: "",
                                            background_color: "white",
                                            color: "black",
                                            expired_date: "",
                                            created_at: "",
                                        })} className="bg-[rgb(200,0,0)] p-2 cursor-pointer active:scale-95">cancel</button> 
                                    </div>                                    
                                </div>
                                <div className="flex flex-wrap gap-10">
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Name card:</span>                                        
                                        <input value={dataCard.name} onChange={(e) => setDataCard({...dataCard, name: e.target.value})} placeholder="name..." className="focus:outline-0 border-b-1"></input>                                   
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Type:</span>
                                        <select value={dataCard.type} onChange={(e) => setDataCard({...dataCard, type: e.target.value})}>
                                            <option value="credit">Credit</option>
                                            <option value="credit">Credit</option>
                                        </select>                                                                                                               
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">last_Numbers:</span>                                    
                                        <input value={dataCard.last_numbers} onChange={(e) => setDataCard({...dataCard, last_numbers: e.target.value})} className="focus:outline-0 border-b-1"></input>
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Expired date:</span>                                        
                                        <input value={dataCard.expired_date?.slice(0,7)} onChange={(e) => setDataCard({...dataCard, expired_date: e.target.value})} type="month" className="[&::-webkit-calendar-picker-indicator]:invert cursor-pointer"></input>
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Background color:</span>
                                        <input value={dataCard.background_color} onChange={(e) => setDataCard({...dataCard, background_color: e.target.value})} type="color"></input>                                                                       
                                    </label>
                                    <label className="flex gap-1">
                                        <span className="font-semibold">Color:</span>
                                        <input value={dataCard.color} onChange={(e) => setDataCard({...dataCard, color: e.target.value})} type="color"></input>                                                                       
                                    </label>
                                </div>
                            </div>                                            
                        </div>                    
                    </div>
                ))}
                
            </div>
        </>
    )
}