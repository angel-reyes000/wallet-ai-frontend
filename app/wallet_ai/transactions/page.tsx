"use client"

import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { Transaction, Category, Card, ModalModes, StateMessage } from '@/app/schemas/schemas';
import Message from '../components/message';

export default function Transactions () {
    const [dataTransactions, setDataTransactions] = useState<Transaction[]>([]);
    const [transaction, setTransaction] = useState<Transaction>({
        id: 0,
        date: "",
        description: "",
        category: "Food",
        card: "Cash",
        amount: 0,
    });
    const [categories, setCategories] = useState<Category[]>();
    const [cards, setCards] = useState<Card[]>();

    const refModalAdd = useRef<HTMLDialogElement>(null);
    const refModalEdit = useRef<HTMLDialogElement>(null);

    const [stateMessage, setStateMessage] = useState<StateMessage>({
        active: false,
        message: "",
        type: "info",
    });
    const [inputSearch, setInputSearch] = useState<string>("");
    const [filters, setFilters] = useState({
        all: true,
        incomes: false,
        expenses: false,
        date: true,
    });

    function openModal (mode: ModalModes, transaction?: Transaction) {
        if (mode === "add") {
            refModalAdd.current?.showModal()
            refModalAdd.current!.style.display = 'flex';

            setTransaction({
                id: 0,
                date: "",
                description: "",
                category: "Food",
                card: "Cash",
                amount: 0,
            })

        } else if (mode === "edit") {
            refModalEdit.current?.showModal()
            refModalEdit.current!.style.display = 'flex';
            setTransaction(transaction!)
        }
    }

    function closeModal(mode: ModalModes) {
        if (mode === "add") {
            refModalAdd.current?.close()
            refModalAdd.current!.style.display = 'none'
        } else if (mode === "edit") {
            refModalEdit.current?.close()
            refModalEdit.current!.style.display = 'none'
        }

        setTransaction({
            id: 0,
            date: "",
            description: "",
            category: "Food",
            card: "Cash",
            amount: 0,
        })
    }

    function typeFilters(a: string, b: string) {
        if (filters.expenses) {
            if (a[0] === "-" || b[0] === "-") {
                return Number(a) - Number(b)
            } else {
                return Number(a) - Number(b)
            }
        } else if (filters.incomes) {
            return Number(b) - Number(a)
        } else {
            return 0
        }
    }

    function dateFilter (a: string, b: string) {
        if (filters.date) {
            return b.localeCompare(a)
        } else {
            return a.localeCompare(b)
        }
    }

    useEffect(() => {

        refModalAdd.current!.style.display = 'none'
        refModalEdit.current!.style.display = 'none'

        const token = localStorage.getItem('token');

        async function getTransactions () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/getTransactions`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`,
                    }
                })

                if (response.status !== 200) {
                    console.log("Error in getTransactions frontend.")
                    return
                }

                const data = await response.json()
                console.log(data)

                setDataTransactions(Array.isArray(data) ? data : []);

            } catch (error) {
                console.log("Error in getTransactions: ", error)
            }
        }

        getTransactions();

        async function getCategories () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/categories/getCategories`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                    }
                })

                if (response.status != 200) {
                    console.log("Error in getCategories frontend.")
                    return
                }

                const data = await response.json();
                //console.log(data)

                setCategories(data)

            } catch (error) {
                console.log("Error in getCategories: ", error)
            }
        }

        getCategories()

        async function getCards () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/getCards`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`,
                    }
                })

                if (response.status != 200) {
                    console.log("Error in getCards frontend.")
                    return
                }

                const data = await response.json();
                console.log(data)

                setCards(data)

            } catch (error) {
                console.log("Error in getCards: ", error)
            }
        }

        getCards()

    }, [])

    async function postTransaction () {
        
        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/postTransaction`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: transaction.date,
                    description: transaction.description,
                    category: transaction.category,
                    card: transaction.card,
                    amount: transaction.amount,
                })
            })
            
            const data = await response.json();
            //console.log(data)

            if (response.status != 200) {
                console.log("Error in getTransactions frontend.")
                setStateMessage({active: true, message: data.detail, type: 'bad'});
                return
            }            

            setDataTransactions(obj => [...obj, data]);
            setStateMessage({active: true, message: "Transaction succesfully created.", type: 'good'});

            setTransaction({
                id: 0,
                date: "",
                description: "",
                category: "Food",
                card: "Cash",
                amount: 0,
            })

        } catch (error) {
            console.log("Error in postTransaction: ", error)
        } finally {
            setTimeout(() => setStateMessage({active: false, message: "", type: 'info'}), 5000);
        }
    }

    async function updateTransaction () {

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/updateTransaction`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({                    
                    id: transaction.id,
                    date: transaction.date,
                    description: transaction.description,
                    category: transaction.category,
                    card: transaction.card,
                    amount: transaction.amount,
                })
            })

            const data = await response.json()
            //console.log(data)

            if (response.status != 200) {
                console.log("Error in updateTransaction")
                return
            }

            setDataTransactions(prev => prev.map(obj => obj.id == data.id ? {...prev,     
                    id: data.id,             
                    date: data.date,
                    description: data.description,
                    category: data.category,
                    card: data.card,
                    amount: data.amount,
                } : obj))

            closeModal("edit");

        } catch (error) {
            console.log("Error in updateTransaction: ", error)
        }
    }

    async function deleteTransaction (transaction_id: number | undefined) {

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/deleteTransaction?transaction_id=${transaction_id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();

            if (response.status != 200) {
                console.log("Error in deleteTransaction")
                return
            }

            //console.log(data);

            setDataTransactions(prev => prev.filter(obj => obj.id !== data.id ? obj : null));

            closeModal("edit");

        } catch (error) {
            console.log("Error in deleteTransaction: ", error)
        }
    }

    return (
        <>
            {/*--------------------------------------MODAL ADD-----------------------------------------------*/}
            <dialog ref={refModalAdd} className='m-auto flex w-[95%] max-w-lg flex-col gap-5 rounded-2xl border border-white/10 bg-app-surface p-5 text-white shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:p-6'>
                <div className='flex items-center justify-between'>
                    <p className='text-xl font-bold'>Create transaction</p>
                    <FaPlus onClick={() => closeModal("add")} size={20} className='rotate-45 cursor-pointer text-white/80 transition-colors hover:text-white' />
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Date:</span>
                        <input value={transaction?.date} onChange={((e) => setTransaction(obj => ({...obj, date: e.target.value})))} type='date' className='app-field'></input>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Category:</span>
                        <select value={transaction?.category} onChange={(e) => setTransaction(obj => ({...obj, category: e.target.value}))} className='app-field cursor-pointer'>
                            {categories?.map(obj => (
                                <option key={obj.id}>{obj.category_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Type:</span>
                        <select value={transaction?.card} onChange={(e) => setTransaction(obj => ({...obj, card: e.target.value}))} className='app-field cursor-pointer'>
                            <option>Cash</option>
                            {cards?.map(obj => (
                                <option key={obj.id}>{obj.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Amount:</span>
                        <input value={transaction?.amount} onChange={(e) => setTransaction(obj => ({...obj, amount: Number(e.target.value)}))} type='number' className='app-field'></input>
                    </label>
                    <label className='flex w-full flex-col gap-1 sm:col-span-2'>
                        <span className='text-sm font-semibold text-green-100/80'>Description:</span>
                        <textarea value={transaction.description} onChange={(e) => setTransaction(obj => ({...obj, description: e.target.value}))} placeholder='This is... for this.' className='app-field min-h-24'></textarea>
                    </label>
                </div>
                <div className='flex flex-row gap-3'>
                    <button onClick={() => postTransaction()} className='btn btn-primary flex-1 py-2.5'>Save</button>
                    <button onClick={() => closeModal("add")} className='btn btn-ghost flex-1 py-2.5'>Cancel</button>
                </div>
            </dialog>
            {/*--------------------------------------MODAL EDIT----------------------------------------------*/}
            <dialog ref={refModalEdit} className='m-auto flex w-[95%] max-w-lg flex-col gap-5 rounded-2xl border border-white/10 bg-app-surface p-5 text-white shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:p-6'>
                <div className='flex items-center justify-between'>
                    <p className='text-xl font-bold'>Edit transaction</p>
                    <FaPlus onClick={() => closeModal("edit")} size={20} className='rotate-45 cursor-pointer text-white/80 transition-colors hover:text-white' />
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Date:</span>
                        <input value={transaction?.date} onChange={((e) => setTransaction(obj => ({...obj, date: e.target.value})))} type='date' className='app-field'></input>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Category:</span>
                        <select value={transaction?.category} onChange={(e) => setTransaction(obj => ({...obj, category: e.target.value}))} className='app-field cursor-pointer'>
                            {categories?.map(obj => (
                                <option key={obj.id}>{obj.category_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Type:</span>
                        <select value={transaction?.card} onChange={(e) => setTransaction(obj => ({...obj, card: e.target.value}))} className='app-field cursor-pointer'>
                            <option>Cash</option>
                            {cards?.map(obj => (
                                <option key={obj.id}>{obj.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex w-full flex-col gap-1'>
                        <span className='text-sm font-semibold text-green-100/80'>Amount:</span>
                        <input value={transaction?.amount} onChange={(e) => setTransaction(obj => ({...obj, amount: Number(e.target.value)}))} type='number' className='app-field'></input>
                    </label>
                    <label className='flex w-full flex-col gap-1 sm:col-span-2'>
                        <span className='text-sm font-semibold text-green-100/80'>Description:</span>
                        <textarea value={transaction.description} onChange={(e) => setTransaction(obj => ({...obj, description: e.target.value}))} placeholder='This is... for this.' className='app-field min-h-24'></textarea>
                    </label>
                </div>
                <div className='flex flex-row gap-3'>
                    <button onClick={() => updateTransaction()} className='btn btn-primary flex-1 py-2.5'>Edit</button>
                    <button onClick={() => closeModal("edit")} className='btn btn-ghost flex-1 py-2.5'>Cancel</button>
                    <button aria-label='Delete transaction' onClick={() => deleteTransaction(transaction.id)} className='btn btn-danger px-3 py-2.5'><FaTrash size={18} /></button>
                </div>
            </dialog>
            {/* {stateMessage.active ? <Message message={stateMessage.message} type={stateMessage.type} /> : null} */}
            <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-5 pb-32 text-white sm:p-8 sm:pb-32 lg:p-10 lg:pb-32">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Transactions</h1>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                        <div className='flex flex-row items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 py-2 transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/30'>
                            <FaSearch size={15} className='text-green-300' />
                            <input value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} className='w-full bg-transparent text-white placeholder:text-white/40 focus:outline-0' placeholder="Search..."></input>
                        </div>
                        <button onClick={() => openModal("add")}
                            className='btn btn-primary px-4 py-2.5'>
                                <FaPlus size={14} />Create transaction
                        </button>
                    </div>
                </div>
                <div className='app-card flex w-full flex-col gap-5'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <p className='mr-1 text-base font-bold'>Order by:</p>
                        <button value={String(filters.all)} onClick={(e) => setFilters({all: !filters.all, incomes: false, expenses: false, date: filters.date})} className={'btn min-w-[88px] ' + (filters.all ? 'btn-primary' : 'btn-ghost')}>All</button>
                        <button value={String(filters.incomes)} onClick={(e) => setFilters({all: false, incomes: !filters.incomes, expenses: false, date: filters.date})} className={'btn min-w-[88px] ' + (filters.incomes ? 'btn-primary' : 'btn-ghost')}>Incomes</button>
                        <button value={String(filters.expenses)} onClick={(e) => setFilters({all: false, incomes: false, expenses: !filters.expenses, date: filters.date})} className={'btn min-w-[88px] ' + (filters.expenses ? 'btn-primary' : 'btn-ghost')}>Expenses</button>
                        <button value={String(filters.expenses)} onClick={(e) => setFilters({all: filters.all, incomes: filters.incomes, expenses: filters.expenses, date: !filters.date})} className={'btn min-w-[88px] ' + (filters.date ? 'btn-primary' : 'btn-ghost')}>Date</button>
                    </div>
                    <div className='w-full overflow-x-auto'>
                    <table className='w-full min-w-[640px] text-left'>
                        <thead>
                            <tr>
                                <th className='app-th'>Date</th>
                                <th className='app-th'>Description</th>
                                <th className='app-th'>Category</th>
                                <th className='app-th'>Type</th>
                                <th className='app-th'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTransactions?.filter(obj =>
                                obj.date.toLowerCase().includes(inputSearch.toLowerCase()) ||
                                obj.description.toLowerCase().includes(inputSearch.toLowerCase()) ||
                                obj.category.toLowerCase().includes(inputSearch.toLowerCase()) ||
                                obj.card.toLowerCase().includes(inputSearch.toLowerCase()) ||
                                obj.type?.toLowerCase().includes(inputSearch.toLowerCase()) ||
                                String(obj.amount).toLowerCase().includes(inputSearch.toLowerCase())
                            ).toSorted((a, b) => dateFilter(a.date, b.date)).sort((a, b) => typeFilters(String(a.amount), String(b.amount)))
                            .map(obj => (
                                <tr key={obj.id} onClick={() => openModal("edit", obj)} className='cursor-pointer border-b border-white/10 transition-colors hover:bg-white/5 hover:text-green-300'>
                                    <td className='app-td whitespace-nowrap'>{obj.date}</td>
                                    <td className='app-td'>{obj.description}</td>
                                    <td className='app-td'>{obj.category}</td>
                                    <td className='app-td'>{obj.card} ({obj.type})</td>
                                    <td className='app-td font-semibold tabular-nums'>{obj.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </>
    )
}
