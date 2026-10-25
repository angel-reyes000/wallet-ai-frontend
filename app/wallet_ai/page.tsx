"use client"

import LineChartTotalMoney from "./components/lineChartTotalMoney"
import PieChartExpensesToCategory from "./components/pieChartExpensesToCategory"
import { FaShop } from "react-icons/fa6"
import { act, useEffect, useState } from "react"
import { Transaction, TotalToCategory } from "../schemas/schemas"
import { filter } from "echarts/types/src/export/api/util.js"

export default function WalletAI () {
    const [lastTransactions, setTransactions] = useState<Transaction[]>();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [listCategoryValue, setListCategoryValue] = useState<TotalToCategory[]>();
    const [filterAllTime, setFilterAllTime] = useState<boolean>(false);
    const [filterMonth, setFilterMonth] =useState<string>("");
    const [filterYear, setFilterYear] = useState<string>("");
    const [dataLabelsX, setDataLabelsX] = useState();
    const [listValuesLineChart, setListValuesLineChart] = useState();
    const [errorFilter, setErrorFilter] = useState<string>("");


    useEffect(() => {

        const token = localStorage.getItem('token');

        if (filterMonth.length > 0 || filterYear.length > 0) {
            setFilterAllTime(false)
        }

        setErrorFilter("");
        setTotalBalance(0);
        setTotalExpenses(0);
        setTotalIncomes(0);

        async function getGraphicTransactions () {

            if (filterMonth.length > 0 && filterYear.length <= 0) {
                setErrorFilter("Can not filter only to month.")
                return
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/getGraphicTransactions?year=${filterYear}&month=${filterMonth}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getTransactionResume: ", data)
                    setErrorFilter(data.datail)
                    return
                }

                setListValuesLineChart(data[0] ?? [])
                setDataLabelsX(data[1] ?? [])

                //console.log("GRIFICALINEAS", data[0])
                //console.log("GRIFICALINEAS", data[1])
                
            } catch (error) {
                console.log("Error in getTransactionResume: ", error)
                setErrorFilter("Error to get data filters.")
            }
        }

        getGraphicTransactions();

        async function getTotalBalancesExpensesIncomes () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/getTotalBalancesExpensesIncomes?year=${filterYear}&month=${filterMonth}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getTransactionResume: ", data)
                    setErrorFilter(data.datail)
                    return
                }

                console.log(data)

                setTotalBalance(data.total_balance);
                setTotalExpenses(data.total_expenses);
                setTotalIncomes(data.total_incomes);

            } catch(error) {
                console.log("Error in getTotalBalancesExpensesIncomes: ", error)
            }
        }

        getTotalBalancesExpensesIncomes();

        async function getTotalToCategoryResume () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/categories/getGraphicCategories?month=${filterMonth}&year=${filterYear}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getTotalToCategoryResume: ", data)
                    return
                }
                //console.log("CATEGORIES: ", data)
                setListCategoryValue(data);

            } catch (error) {
                console.log("Error in getTotalToCategoryResume: ", error)
            }
        }

        getTotalToCategoryResume();

        async function getLastTransactions () {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/transactions/getLastTransactions?month=${filterMonth}&year=${filterYear}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Erorr in getLastTransactions: ", data)
                    return
                }
                
                setTransactions(data)

            } catch (error) {
                console.log("Error in getLastTransactions: ", error)
            }
        }

        getLastTransactions();
        
    }, [filterAllTime, filterYear, filterMonth])

    function activeFilterAllTime () {
        setFilterMonth("")
        setFilterYear("")
    }

    return (
        <>
            <div className="flex flex-col h-full w-full p-10 gap-10">
                <div className="flex justify-between">
                    <div>
                        <h1 className='font-bold text-4xl'>Resume</h1>
                        <p>Analize visually the resume of yours accounts</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">Filter to:</span>
                        <label className="flex items-center gap-1 border-2 border-gray-400 rounded-sm px-1">
                            <span className="font-semibold">Month:</span>
                            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="p-1 focus:outline-0">
                                <option value="">NA</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </label>
                        <label className="flex items-center gap-1 border-2 border-gray-400 rounded-sm pl-1">
                            <span className="font-semibold">Year:</span>
                            <input value={filterYear} onChange={(e) => setFilterYear(e.target.value)} 
                                type="number" min={2000} 
                                className="p-1 focus:outline-0">
                            </input>
                        </label>                        
                        <button onClick={() => activeFilterAllTime()} className="px-5 py-1 text-white font-bold cursor-pointer bg-[rgb(0,100,0)] active:scale-95">All time</button>                    
                    </div>
                </div>                
                <div className="w-full h-[300px]">
                    <LineChartTotalMoney ListValuesLineChart={listValuesLineChart!} DataLabelsX={dataLabelsX!} />
                </div>
                <div className="flex justify-between bg-yellow-100 gap-3">
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total balance</p>
                        <p className="font-semibold">{totalBalance}</p>
                    </div>
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total Incomes</p>
                        <p className="font-semibold">{totalIncomes}</p>
                    </div>
                    <div className="flex flex-col border-1 px-2 py-1 w-full rounded-md bg-gray-100">
                        <p className="font-bold text-[0.9rem]">Total expenses</p>
                        <p className="font-semibold">{totalExpenses}</p>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] h-[400px]">
                    <div className="w-full h-full bg-yellow-100">
                        <PieChartExpensesToCategory TotalCategoryValue={listCategoryValue} />
                    </div>
                    <div>
                        <div className="flex flex-col px-3 py-1 gap-1">
                            <h2 className="font-bold text-[1.6rem]">Last moviments</h2>
                            <div className="flex flex-col overflow-y-scroll max-h-[400px]">
                                <table>
                                    <thead>
                                        <tr className="bg-[rgb(0,100,0)] text-white">
                                            <th className="p-1">Category</th>
                                            <th className="p-1">Type</th>
                                            <th className="p-1">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="overflow-y-scroll max-h-[200px]">
                                        {lastTransactions?.map((obj) => (                                            
                                           <tr key={obj.id} className="text-center border-b-1 font-semibold hover:bg-gray-300">
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