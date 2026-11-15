"use client"

import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/app/schemas/schemas";
import { validateCard, hasErrors, apiErrorMessage, type FieldErrors } from "@/app/schemas/validation";

type CardStatus = { type: "error" | "success", text: string } | null;

function ErrorList ({ errors, status }: { errors: FieldErrors, status: CardStatus }) {
    const messages = Object.values(errors);

    if (messages.length === 0 && !status) return null;

    return (
        <div role="alert" className="flex flex-col gap-1 text-sm font-medium">
            {messages.map(text => <p key={text} className="text-red-400">{text}</p>)}
            {status && <p className={status.type === "error" ? "text-red-400" : "text-green-300"}>{status.text}</p>}
        </div>
    )
}

export default function Cards () {
    const [openModalAddCard, setOpenModalAddCard] = useState<boolean>(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [dataCard, setDataCard] = useState<Card>({
        id: 0,
        name: "",
        type: "",
        last_numbers: "",
        background_color: "#ffffff",
        color: "#000000",
        expired_date: "",
        created_at: "",
    });

    const [attempted, setAttempted] = useState<boolean>(false);
    const [cardStatus, setCardStatus] = useState<CardStatus>(null);

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

                setCards(Array.isArray(data) ? data: []);
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

    const cardErrors = attempted
        ? validateCard(dataCard, { otherNames: cards.filter(obj => obj.id !== dataCard.id).map(obj => obj.name) })
        : {};

    function submitCard (mode: "add" | "edit") {
        setAttempted(true);
        setCardStatus(null);

        const found = validateCard(dataCard, { otherNames: cards.filter(obj => obj.id !== dataCard.id).map(obj => obj.name) });

        if (hasErrors(found)) return;

        if (mode === "add") {
            postCard();
        } else {
            updateCard();
        }
    }

    function resetFormFeedback () {
        setAttempted(false);
        setCardStatus(null);
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
                setCardStatus({ type: "error", text: apiErrorMessage(data) });
                return
            }

            console.log(data)
            setCards(prev => [...prev, data])
            refModalAddCard.current?.close()
            refModalAddCard.current!.style.display = 'none';
            resetFormFeedback();

        } catch (error) {
            console.log("Error in postCard: ", error)
            setCardStatus({ type: "error", text: "Could not reach the server, try again." });
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
                setCardStatus({ type: "error", text: apiErrorMessage(data) });
                return
            }

            console.log(data)
            resetFormFeedback();
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
            setCardStatus({ type: "error", text: "Could not reach the server, try again." });
        }
    }

    return (
        <>
            <dialog ref={refModalAddCard} className="m-auto flex w-[95%] max-w-lg flex-col gap-5 rounded-2xl border border-white/10 bg-app-surface p-5 text-white shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add Card</h1>
                    <button aria-label="Close" onClick={() => {
                        refModalAddCard.current?.close()
                        refModalAddCard.current!.style.display = 'none';
                        resetFormFeedback();
                    }} className="cursor-pointer rounded-lg p-2 rotate-45 transition-colors hover:bg-white/10 active-scale-95"><FaPlus size={22} /></button>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex h-[200px] w-full max-w-[400px] flex-col justify-between gap-5 self-center rounded-2xl p-5 shadow-lg" style={{backgroundColor: `${dataCard.background_color}`, color: `${dataCard.color}`}}>
                        <div className="flex justify-between gap-5">
                            <label className="flex gap-1 text-[1.05rem] font-semibold">
                                <span>Name: </span>
                                <input value={dataCard.name} onChange={(e) => setDataCard({...dataCard, name: e.target.value})} maxLength={30} className="w-[80%] focus:outline-0 border-b-1"></input>
                            </label>
                            <label className="flex gap-1 text-[1.05rem] font-semibold">
                                <span>Type:</span>
                                <select value={dataCard.type} onChange={(e) => setDataCard({...dataCard, type: e.target.value})}>
                                    <option value={''} disabled>Select type</option>
                                    <option value={'Credit'}>Credit</option>
                                    <option value={'Debit'}>Debit</option>
                                </select>
                            </label>
                        </div>
                        <label className="w-[80%] text-[1.05rem] font-semibold">
                            Last four digits: *******************
                            <input value={dataCard.last_numbers} onChange={(e) => setDataCard({...dataCard, last_numbers: e.target.value.replace(/\D/g, "").slice(0, 4)})} inputMode="numeric" maxLength={4} className="w-[20%]"></input>
                        </label>
                        <div className="flex items-center justify-between">
                            <label>
                                <span className="font-semibold">CVV: ***</span>
                            </label>
                            <label className="font-semibold">
                                <span >Vence: </span>
                                <input value={dataCard.expired_date} onChange={(e) => setDataCard({...dataCard, expired_date: e.target.value})} type="month" min="2000-01" max="2100-12"></input>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-3 text-sm font-medium">
                        <label className="flex items-center gap-2">
                            Background color:
                            <input value={dataCard.background_color} onChange={(e) => setDataCard({...dataCard, background_color: e.target.value})} type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent"></input>
                        </label>
                        <label className="flex items-center gap-2">
                            Color:
                            <input value={dataCard.color} onChange={(e) => setDataCard({...dataCard, color: e.target.value})} type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent"></input>
                        </label>
                    </div>
                </div>
                <ErrorList errors={cardErrors} status={cardStatus} />
                <div className="flex justify-end gap-3">
                    <button onClick={() => submitCard("add")} className="btn btn-primary w-[110px]">Save</button>
                    <button onClick={() => {
                        refModalAddCard.current?.close()
                        refModalAddCard.current!.style.display = 'none';
                        resetFormFeedback();
                    }} className="btn btn-ghost w-[110px]">Cancel</button>
                </div>
            </dialog>
            <div className="flex w-full min-w-0 flex-1 flex-col gap-4 p-5 pb-40 text-white sm:p-8 sm:pb-40 lg:p-10 lg:pb-40">
                <div className="flex flex-wrap items-center justify-between gap-5 pb-2">
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Cards</h1>
                        <p className="mt-1 text-green-100/70">Analize visually your cards</p>
                    </div>
                    <button onClick={() => {
                        resetFormFeedback();
                        refModalAddCard.current?.showModal()
                        refModalAddCard.current!.style.display = 'flex';
                        setDataCard({
                            id: 0,
                            name: "",
                            type: "",
                            last_numbers: "",
                            background_color: "#ffffff",
                            color: "#000000",
                            expired_date: "",
                            created_at: "",
                        })
                    }} className="btn btn-primary px-5 py-2.5 text-base"><FaPlus size={16}/> Add card</button>
                </div>
                {cards.sort((a, b) => a.expired_date?.localeCompare(b?.expired_date)).map(card => card.id !== dataCard.id ? (
                    <div key={card.id} className="flex flex-wrap gap-5">
                        <div className="app-card flex w-full flex-col items-center gap-5 lg:flex-row lg:items-start">
                            <div className="flex h-[200px] w-full max-w-[300px] shrink-0 flex-col justify-between gap-5 rounded-2xl p-5 shadow-lg sm:max-w-[380px]" style={{backgroundColor: `${card.background_color}`, color: `${card.color}`}}>
                                <div className="flex justify-between">
                                    <p className="text-[1.05rem] font-semibold">{card.name}</p>
                                    <p className="text-[1.05rem] font-semibold">{card.type}</p>
                                </div>
                                <p className="w-full text-[1.05rem] font-semibold">*******************{card.last_numbers}</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">CVV: ***</p>
                                    <p className="font-semibold">Vence: {card.expired_date?.slice(0,7)}</p>
                                </div>
                            </div>
                            <div className="flex w-full min-w-0 flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Details</h2>
                                    <button onClick={() => { resetFormFeedback(); setDataCard(card); }} className="btn btn-primary">Edit card</button>
                                </div>
                                <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Name card:</span>
                                        <p>{card.name}</p>
                                    </label>
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Type:</span>
                                        <p>{card.type}</p>
                                    </label>
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Last four digits</span>
                                        <p>{card.last_numbers}</p>
                                    </label>
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Expired date:</span>
                                        <p>{card.expired_date?.slice(0,7)}</p>
                                    </label>
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Background color:</span>
                                        <p>{card.background_color}</p>
                                    </label>
                                    <label className="flex flex-wrap gap-1">
                                        <span className="font-semibold text-green-100/70">Color:</span>
                                        <p>{card.color}</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={card.id} className="flex flex-wrap gap-5">
                        <div className="app-card flex w-full flex-col items-center gap-5 lg:flex-row lg:items-start">
                            <div className="flex h-[200px] w-full max-w-[300px] shrink-0 flex-col justify-between gap-5 rounded-2xl p-5 shadow-lg sm:max-w-[380px]" style={{backgroundColor: `${dataCard.background_color}`,  color: `${dataCard.color}`}}>
                                <div className="flex justify-between">
                                    <p className="text-[1.05rem] font-semibold">{dataCard.name}</p>
                                    <p className="text-[1.05rem] font-semibold">{dataCard.type}</p>
                                </div>
                                <p className="w-full text-[1.05rem] font-semibold">*******************{dataCard.last_numbers}</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">CVV: ***</p>
                                    <p className="font-semibold">Vence: {dataCard.expired_date?.slice(0,7)}</p>
                                </div>
                            </div>
                            <div className="flex w-full min-w-0 flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Details</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => submitCard("edit")} className="btn btn-primary">Save</button>
                                        <button onClick={() => { resetFormFeedback(); setDataCard({
                                            id: 0,
                                            name: "",
                                            type: "",
                                            last_numbers: "",
                                            background_color: "#ffffff",
                                            color: "#000000",
                                            expired_date: "",
                                            created_at: "",
                                        }); }} className="btn btn-danger">cancel</button>
                                    </div>
                                </div>
                                <ErrorList errors={cardErrors} status={cardStatus} />
                                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <label className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-green-100/70">Name card:</span>
                                        <input value={dataCard.name} onChange={(e) => setDataCard({...dataCard, name: e.target.value})} placeholder="name..." maxLength={30} aria-invalid={!!cardErrors.name} className={"app-field" + (cardErrors.name ? " !border-red-500" : "")}></input>
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-green-100/70">Type:</span>
                                        <select value={dataCard.type} onChange={(e) => setDataCard({...dataCard, type: e.target.value})} className="app-field cursor-pointer">
                                            <option value={''} disabled>Select type</option>
                                    <option value={'Credit'}>Credit</option>
                                            <option value={'Debit'}>Debit</option>
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-green-100/70">Last four digits:</span>
                                        <input value={dataCard.last_numbers} onChange={(e) => setDataCard({...dataCard, last_numbers: e.target.value.replace(/\D/g, "").slice(0, 4)})} inputMode="numeric" maxLength={4} aria-invalid={!!cardErrors.last_numbers} className={"app-field" + (cardErrors.last_numbers ? " !border-red-500" : "")}></input>
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-green-100/70">Expired date:</span>
                                        <input value={dataCard.expired_date?.slice(0,7)} onChange={(e) => setDataCard({...dataCard, expired_date: e.target.value})} type="month" min="2000-01" max="2100-12" aria-invalid={!!cardErrors.expired_date} className={"app-field [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" + (cardErrors.expired_date ? " !border-red-500" : "")}></input>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-green-100/70">Background color:</span>
                                        <input value={dataCard.background_color} onChange={(e) => setDataCard({...dataCard, background_color: e.target.value})} type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent"></input>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-green-100/70">Color:</span>
                                        <input value={dataCard.color} onChange={(e) => setDataCard({...dataCard, color: e.target.value})} type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent"></input>
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
