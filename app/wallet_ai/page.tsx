"use client"

import LineChartTotalMoney from "./components/lineChartTotalMoney"
import PieChartExpensesToCategory from "./components/pieChartExpensesToCategory"
import { FaShop } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { Transaction, TotalToCategory } from "../schemas/schemas"

export default function WalletAI () {
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [currentYear, setCurrentYear] = useState<string>("");
    const [listTotalBalance, setListTotalBalance] = useState<Array<number>>();
    const [listCategoryValue, setListCategoryValue] = useState<TotalToCategory[]>();

    useEffect(() => {

        const token = localStorage.getItem('token');

        async function getTransactionResume () {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/getTransactions`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getTransactionResume: ", data)
                    return
                }

                setTransactions(data)

                data.map((obj: Transaction) => setTotalBalance(prev => prev + obj.amount))
                data.map((obj: Transaction) => setTotalIncomes(prev => prev + (obj.amount >= 0 ? obj.amount : 0)))
                data.map((obj: Transaction) => setTotalExpenses(prev => prev + (obj.amount <= 0 ? obj.amount : 0)))


                const totalMonths = [0,0,0,0,0,0,0,0,0,0,0,0]
                const currentYear = String(new Date().getFullYear());
                setCurrentYear(currentYear)
                
                for (let i = 0; i < data.length; i++) {
                    let amount = data[i].amount

                    if (data[i].date.split("-")[0] == currentYear) {
                        switch ((data[i].date.split("-")[1])) {
                            case "01":
                                totalMonths[0] += amount
                                break;
                            case "02":
                                totalMonths[1] += amount
                                break;
                            case "03":
                                totalMonths[2] += amount
                                break;
                            case "04":
                                totalMonths[3] += amount
                                break;
                            case "05":
                                totalMonths[4] += amount
                                break;
                            case "06":
                                totalMonths[5] += amount
                                break;
                            case "07":
                                totalMonths[6] += amount
                                break;
                            case "08":
                                totalMonths[7] += amount
                                break;
                            case "09":
                                totalMonths[8] += amount
                                break;
                            case "10":
                                totalMonths[9] += amount
                                break;
                            case "11":
                                totalMonths[10] += amount
                                break;
                            case "12":
                                totalMonths[11] += amount
                                break;
                        }
                    }                    
                }

                console.log(totalMonths)
                setListTotalBalance(totalMonths)
                return data
                

            } catch (error) {
                console.log("Error in getTransactionResume: ", error)
            }
        }

        getTransactionResume();

        async function getTotalToCategoryResume () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/categories/getTotalToCategory`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getTransactionResume: ", data)
                    return
                }

                setListCategoryValue(data);

            } catch (error) {
                console.log("Error in getTotalToCategoryResume: ", error)
            }
        }

        getTotalToCategoryResume();
        

    }, [])

    return (
        <>
            <div className="flex flex-col h-full w-full p-10 gap-10">
                <div onClick={() => console.log(listCategoryValue)}>
                    <h1 className='font-bold text-4xl'>Resume {` (${currentYear})`}</h1>
                    <p>Analize visually the resume of yours accounts</p>
                </div>                
                <div className="w-full h-[300px]">
                    <LineChartTotalMoney ListTotalBalance={listTotalBalance!} />
                </div>
                <div className="flex justify-between bg-yellow-100 gap-3">
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total balance</p>
                        <p className="font-semibold">{(totalBalance / 2)}</p>
                    </div>
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total Incomes</p>
                        <p className="font-semibold">{(totalIncomes / 2)}</p>
                    </div>
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total expenses</p>
                        <p className="font-semibold">{(totalExpenses / 2)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] h-[400px]">
                    <div className="w-full h-full bg-yellow-100">
                        <PieChartExpensesToCategory TotalCategoryValue={listCategoryValue} />
                    </div>
                    <div>
                        <div className="flex flex-col px-3 py-1 gap-1">
                            <h2 className="font-bold text-[1.6rem]">Last seven moviments</h2>
                            <div className="flex flex-col">
                                <table>
                                    <thead>
                                        <tr className="bg-[rgb(0,100,0)] text-white">
                                            <th className="p-1">Category</th>
                                            <th className="p-1">Type</th>
                                            <th className="p-1">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions?.slice(0,7).toSorted((a, b) => a.date.localeCompare(b.date))?.map((obj) => (                                            
                                           <tr key={obj.id} className="text-center border-b-1 font-semibold hover:bg-gray-400">
                                                <td className="p-2">{obj.category}</td>
                                                <td className="p-2">{obj.type}</td>
                                                <td className="p-2">{obj.amount}</td>
                                            </tr>  
                                        ))}                                                                              
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}