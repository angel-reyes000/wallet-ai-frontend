"use client"

import { FaPlus, FaSearch } from 'react-icons/fa'
import { useEffect, useRef } from 'react'

export default function Transactions () {

    const refModalAdd = useRef<HTMLDialogElement>(null);

    useEffect(() => {

        refModalAdd.current!.style.display = 'none'

    }, [])

    function openModal () {
        refModalAdd.current?.showModal()
        refModalAdd.current!.style.display = 'flex';
    }

    function closeModal() {
        refModalAdd.current?.close()
        refModalAdd.current!.style.display = 'none'
    }

    return (
        <>
            <dialog ref={refModalAdd} className='flex flex-col m-auto max-w-[50%] p-5 rounded-lg gap-5'>
                <div className='flex justify-between'>
                    <p className='font-bold text-xl'>Create transaction</p>
                    <FaPlus onClick={() => closeModal()} size={20} className='rotate-45 cursor-pointer' />
                </div>                
                <div className='grid grid-cols-[auto_auto] gap-1'>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Date:</span>
                        <input type='date' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Category:</span>
                        <select className='border-2 border-gray-400 rounded-md p-1'>
                            <option>option1</option>
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Type:</span>
                        <select className='border-2 border-gray-400 rounded-md p-1'>
                            <option>option1</option>
                        </select>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Amount:</span>
                        <input type='number' className='border-2 border-gray-400 rounded-md p-1'></input>
                    </label>
                    <label className='flex flex-col w-full'>
                        <span className='font-semibold'>Description:</span>
                        <textarea placeholder='This is... for this.' className='border-2 border-gray-400 rounded-md p-1'></textarea>
                    </label>
                </div>
                <div className='flex flex-row justify-between'>
                    <button className='flex flex-row items-center justify-center p-2 rounded-lg text-white font-semibold bg-[rgb(5,100,0)] cursor-pointer min-w-[40%] hover:bg-[rgb(5,80,0)] active:scale-95'>Save</button>
                    <button className='flex flex-row items-center justify-center p-2 rounded-lg text-black font-semibold border-2 border-gray-400 cursor-pointer min-w-[40%] hover:bg-gray-200 active:scale-95'>Cancel</button>
                </div>
            </dialog>
            <div className="flex flex-col p-10 w-full gap-4">
                <div className="flex flex-row justify-between">
                    <h1 className='font-bold text-4xl'>Transactions</h1>
                    <div className='flex flex-row items-center gap-5'>
                        <div className='flex flex-row items-center border-3 border-gray-400 p-1 rounded-lg gap-2'>
                            <FaSearch size={15} />
                            <input className='focus:outline-0' placeholder="Search..."></input>
                        </div>
                        <button onClick={() => openModal()}
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
                            <tr className='border-b-3 border-gray-300 hover:bg-gray-200'>
                                <td className='p-3'>10/12</td>
                                <td className='p-3'>Supermarket</td>
                                <td className='p-3'>Food</td>
                                <td className='p-3'>Efective</td>
                                <td className='p-3'>50</td>
                            </tr>
                            <tr className='border-b-3 border-gray-300 hover:bg-gray-200'>
                                <td className='p-3'>10/12</td>
                                <td className='p-3'>Supermarket</td>
                                <td className='p-3'>Food</td>
                                <td className='p-3'>Efective</td>
                                <td className='p-3'>50</td>
                            </tr>
                            <tr className='border-b-3 border-gray-300 hover:bg-gray-200'>
                                <td className='p-3'>10/12</td>
                                <td className='p-3'>Supermarket</td>
                                <td className='p-3'>Food</td>
                                <td className='p-3'>Efective</td>
                                <td className='p-3'>50</td>
                            </tr>
                            <tr className='border-b-3 border-gray-300 hover:bg-gray-200'>
                                <td className='p-3'>10/12</td>
                                <td className='p-3'>Supermarket</td>
                                <td className='p-3'>Food</td>
                                <td className='p-3'>Efective</td>
                                <td className='p-3'>50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}