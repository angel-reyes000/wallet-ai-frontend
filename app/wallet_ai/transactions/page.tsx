"use client"

import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { Transaction, Category, Type, ModalModes, StateMessage } from '@/app/schemas/schemas';
import Message from '../components/message';

export default function Transactions () {
    const [dataTransactions, setDataTransactions] = useState<Transaction[]>([]);
    const [transaction, setTransaction] = useState<Transaction>({
        id: 0,
        date: "",
        description: "",
        category: "Food",
        type: "Cash",
        amount: 0,
    });
    const [categories, setCategories] = useState<Category[]>();
    const [types, setTypes] = useState<Type[]>();

    const refModalAdd = useRef<HTMLDialogElement>(null);
    const refModalEdit = useRef<HTMLDialogElement>(null);

    const [stateMessage, setStateMessage] = useState<StateMessage>({
        active: false,
        message: "",
        type: "info",
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
                type: "Cash",
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
            type: "Cash",
            amount: 0,
        })
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

                if (response.status != 200) {
                    console.log("Error in getTransactions frontend.")
                    return
                }

                const data = await response.json()
                //console.log(data)

                setDataTransactions(data);

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

        async function getTypes () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/types/getTypes`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                    }
                })

                if (response.status != 200) {
                    console.log("Error in getTypes frontend.")
                    return
                }

                const data = await response.json();
                //console.log(data)

                setTypes(data)

            } catch (error) {
                console.log("Error in getTypes: ", error)
            }
        }

        getTypes()

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
                    type: transaction.type,
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
                type: "Cash",
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
                    type: transaction.type,
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
                    type: data.type,
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
            <dialog ref={refModalAdd} className='flex flex-col m-auto max-w-[50%] p-5 rounded-lg gap-5'>
                <div className='flex justify-between'>
                    <p className='font-bold text-xl'>Create transaction</p>
                    <FaPlus onClick={() => closeModal("add")} size={20} className='rotate-45 cursor-pointer' />
                </div>                
                <div className='grid grid-cols-[auto_auto] gap-1'>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Date:</span>
                        <input value={transaction?.date} onChange={((e) => setTransaction(obj => ({...obj, date: e.target.value})))} type='date' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Category:</span>
                        <select value={transaction?.category} onChange={(e) => setTransaction(obj => ({...obj, category: e.target.value}))} className='border-2 border-gray-400 rounded-md p-1'>
                            {categories?.map(obj => (
                                <option key={obj.id}>{obj.category_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Type:</span>
                        <select value={transaction?.type} onChange={(e) => setTransaction(obj => ({...obj, type: e.target.value}))} className='border-2 border-gray-400 rounded-md p-1'>
                            {types?.map(obj => (
                                <option key={obj.id}>{obj.type_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Amount:</span>
                        <input value={transaction?.amount} onChange={(e) => setTransaction(obj => ({...obj, amount: Number(e.target.value)}))} type='number' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full col-span-2'>
                        <span className='font-semibold'>Description:</span>
                        <textarea value={transaction.description} onChange={(e) => setTransaction(obj => ({...obj, description: e.target.value}))} placeholder='This is... for this.' className='border-2 border-gray-400 rounded-md p-1'></textarea>
                    </label>
                </div>
                <div className='flex flex-row justify-between'>
                    <button onClick={() => postTransaction()} className='flex flex-row items-center justify-center p-2 rounded-lg text-white font-semibold bg-[rgb(5,100,0)] cursor-pointer min-w-[40%] hover:bg-[rgb(5,80,0)] active:scale-95'>Save</button>
                    <button onClick={() => closeModal("add")} className='flex flex-row items-center justify-center p-2 rounded-lg text-black font-semibold border-2 border-gray-400 cursor-pointer min-w-[40%] hover:bg-gray-200 active:scale-95'>Cancel</button>
                </div>
            </dialog>
            {/*--------------------------------------MODAL EDIT----------------------------------------------*/}
            <dialog ref={refModalEdit} className='flex flex-col m-auto max-w-[50%] p-5 rounded-lg gap-5'>
                <div className='flex justify-between'>
                    <p className='font-bold text-xl'>Edit transaction</p>
                    <FaPlus onClick={() => closeModal("edit")} size={20} className='rotate-45 cursor-pointer' />
                </div>                
                <div className='grid grid-cols-[auto_auto] gap-1'>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Date:</span>
                        <input value={transaction?.date} onChange={((e) => setTransaction(obj => ({...obj, date: e.target.value})))} type='date' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Category:</span>
                        <select value={transaction?.category} onChange={(e) => setTransaction(obj => ({...obj, category: e.target.value}))} className='border-2 border-gray-400 rounded-md p-1'>
                            {categories?.map(obj => (
                                <option key={obj.id}>{obj.category_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Type:</span>
                        <select value={transaction?.type} onChange={(e) => setTransaction(obj => ({...obj, type: e.target.value}))} className='border-2 border-gray-400 rounded-md p-1'>
                            {types?.map(obj => (
                                <option key={obj.id}>{obj.type_name}</option>
                            ))}
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Amount:</span>
                        <input value={transaction?.amount} onChange={(e) => setTransaction(obj => ({...obj, amount: Number(e.target.value)}))} type='number' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full col-span-2'>
                        <span className='font-semibold'>Description:</span>
                        <textarea value={transaction.description} onChange={(e) => setTransaction(obj => ({...obj, description: e.target.value}))} placeholder='This is... for this.' className='border-2 border-gray-400 rounded-md p-1'></textarea>
                    </label>
                </div>
                <div className='flex flex-row justify-between'>
                    <button onClick={() => updateTransaction()} className='flex flex-row items-center justify-center p-2 rounded-lg text-white font-semibold bg-[rgb(5,100,0)] cursor-pointer min-w-[40%] hover:bg-[rgb(5,80,0)] active:scale-95'>Edit</button>
                    <button onClick={() => closeModal("edit")} className='flex flex-row items-center justify-center p-2 rounded-lg text-black font-semibold border-2 border-gray-400 cursor-pointer min-w-[40%] hover:bg-gray-200 active:scale-95'>Cancel</button>
                </div>
                <div className='flex flex-row justify-end'>
                    <button onClick={() => deleteTransaction(transaction.id)} className='flex flex-row items-center justify-center p-2 rounded-lg text-white font-semibold bg-red-600 cursor-pointer w-fit hover:bg-red-600 active:scale-95'><FaTrash size={20} /></button>
                </div>
            </dialog>
            {stateMessage.active ? <Message message={stateMessage.message} type={stateMessage.type} /> : null}
            <div className="flex flex-col p-10 w-full gap-4">
                <div className="flex flex-row justify-between">
                    <h1 className='font-bold text-4xl'>Transactions</h1>
                    <div className='flex flex-row items-center gap-5'>
                        <div className='flex flex-row items-center border-3 border-gray-400 p-1 rounded-lg gap-2'>
                            <FaSearch size={15} />
                            <input className='focus:outline-0' placeholder="Search..."></input>
                        </div>
                        <button onClick={() => openModal("add")}
                            className='flex flex-row items-center p-3 rounded-lg text-white font-semibold bg-[rgb(5,100,0)] cursor-pointer gap-2 hover:bg-[rgb(5,80,0)] active:scale-95'>
                                <FaPlus size={15} />Create transaction
                        </button>
                    </div>
                </div>
                <div className='flex flex-col bg-white rounded-lg p-5 gap-5'>
                    <div className='flex items-center gap-1'>
                        <p className='text-lg font-bold'>Filters:</p>
                        <button className='py-1 border-2 border-gray-400 min-w-[100px] font-semibold rounded-sm cursor-pointer hover:bg-gray-200 active:scale-95'>All</button>
                        <button className='py-1 border-2 border-gray-400 min-w-[100px] font-semibold rounded-sm cursor-pointer hover:bg-gray-200 active:scale-95'>Incomes</button>
                        <button className='py-1 border-2 border-gray-400 min-w-[100px] font-semibold rounded-sm cursor-pointer hover:bg-gray-200 active:scale-95'>Expenses</button>
                    </div>
                    <table className='w-full text-center'>
                        <thead className='border-b-3 border-gray-500'>
                            <tr>
                                <th className='p-1'>Date</th>
                                <th className='p-1'>Description</th>
                                <th className='p-1'>Category</th>
                                <th className='p-1'>Type</th>
                                <th className='p-1'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTransactions?.map(obj => (
                                <tr key={obj.id} onClick={() => openModal("edit", obj)} className='border-b-3 border-gray-300 hover:bg-gray-200 cursor-pointer'>
                                    <td className='p-3'>{obj.date}</td>
                                    <td className='p-3'>{obj.description}</td>
                                    <td className='p-3'>{obj.category}</td>
                                    <td className='p-3'>{obj.type}</td>
                                    <td className='p-3'>{obj.amount}</td>
                                </tr>
                            ))}                            
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}