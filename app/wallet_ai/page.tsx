"use client"

import LineChartTotalMoney from "./components/graphics/lineChartTotalMoney"
import PieChartExpensesToCategory from "./components/graphics/pieChartExpensesToCategory"
import { FaShop } from "react-icons/fa6"
import { act, useEffect, useState } from "react"
import { Transaction, TotalToCategory, ListCardsBarChart, TotalToType } from "../schemas/schemas"
import BarChartTotalTypes from '@/app/wallet_ai/components/graphics/barChartTotalTypes';
import { validatePeriod, MIN_YEAR, MAX_YEAR } from "@/app/schemas/validation";

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
    const [listCardsBarChart, setListCardsBarChart] = useState<ListCardsBarChart[]>();
    const [listTotalToType, setListTotalToType] = useState<TotalToType[]>();


    useEffect(() => {

        const token = localStorage.getItem('token');

        // Do not query with a half typed year ("20") or a month without year: show why instead.
        const periodError = validatePeriod(filterMonth, filterYear);

        if (periodError) {
            setErrorFilter(periodError);
            return
        }

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
                    setErrorFilter(data.detail)
                    return
                }

                setListValuesLineChart(data[0] ?? [])
                setDataLabelsX(data[1] ?? [])
                
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
                    setErrorFilter(data.detail)
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
                
                setTransactions(Array.isArray(data) ? data : [])

            } catch (error) {
                console.log("Error in getLastTransactions: ", error)
            }
        }

        getLastTransactions();

        async function getTotalCardsBarChart () {

            const token = localStorage.getItem('token')

            try {
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/getTotalCardsBarChart?year=${filterYear}&month=${filterMonth}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Error to getTotalCardsBarChart.")
                }

                setListCardsBarChart(data)
                console.log("CAAARDSSS: ", data);

            } catch (error) {
                console.log("Error in getTotalCardsBarChart: ", error)
            }
        }

        getTotalCardsBarChart();

        async function getTotalToType () {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/getTotalToType?year=${filterYear}&month=${filterMonth}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();

                if (response.status != 200) {
                    console.log("Error to getTotalToType: ", data)
                    setListTotalToType([])
                    return
                }

                setListTotalToType(Array.isArray(data) ? data : [])
            } catch (error) {
                console.log("Error in getTotalToType: ", error)
            }
        }

        getTotalToType();

        
    }, [filterAllTime, filterYear, filterMonth])

    function activeFilterAllTime () {
        setFilterMonth("")
        setFilterYear("")
    }

    return (
        <>
            <div className="flex min-w-0 flex-1 flex-col gap-6 p-5 pb-40 text-white sm:p-8 sm:pb-40 lg:p-10 lg:pb-40">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Resume</h1>
                        <p className="mt-1 text-green-100/70">Analize visually the resume of yours accounts</p>
                    </div>
                    <div className="app-card flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
                        <span className="text-base font-bold">Filter to:</span>
                        <label className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-green-100/80">Month:</span>
                            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="app-field w-full cursor-pointer sm:w-auto">
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
                        <label className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-green-100/80">Year:</span>
                            <input value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                                type="number" min={MIN_YEAR} max={MAX_YEAR} aria-invalid={!!errorFilter}
                                className={"app-field w-full sm:w-28" + (errorFilter ? " !border-red-500" : "")}>
                            </input>
                        </label>
                        <button onClick={() => activeFilterAllTime()} className="btn btn-primary">All time</button>
                        {errorFilter && <p role="alert" className="w-full text-sm font-medium text-red-400 sm:basis-full">{errorFilter}</p>}
                    </div>
                </div>
                <div className="app-card relative w-full md:h-[300px]">
                    <div className="z-10 mb-3 flex flex-wrap gap-x-20 gap-y-2 md:absolute md:top-4 md:right-5 md:mb-0 md:justify-end">
                        <div className="flex flex-col">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total balance</p>
                            <p className="text-xl font-bold tabular-nums">{totalBalance || 0}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total Incomes</p>
                            <p className="text-xl font-bold tabular-nums text-green-400">{totalIncomes || 0}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total expenses</p>
                            <p className="text-xl font-bold tabular-nums text-red-400">{totalExpenses || 0}</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full md:h-full">
                        <LineChartTotalMoney ListValuesLineChart={listValuesLineChart!} DataLabelsX={dataLabelsX!} />
                    </div>
                </div>
                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="app-card h-[360px] min-w-0 w-full lg:h-[420px] lg:flex-1">
                        <PieChartExpensesToCategory TotalCategoryValue={listCategoryValue} />
                    </div>
                    <div className="app-card flex min-w-0 flex-col gap-3 lg:w-[420px] lg:shrink-0">
                        <h2 className="text-xl font-bold">Last moviments</h2>
                        <div className="flex max-h-[340px] flex-col overflow-y-auto lg:max-h-[340px]">
                            <table className="w-full">
                                <thead className="sticky top-0">
                                    <tr>
                                        <th className="app-th">Category</th>
                                        <th className="app-th">Type</th>
                                        <th className="app-th">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastTransactions?.map((obj) => (
                                        <tr key={obj.id} className="border-b border-white/10 transition-colors hover:bg-white/5 hover:text-green-300">
                                            <td className="app-td">{obj.category}</td>
                                            <td className="app-td">{obj.card}</td>
                                            <td className="app-td tabular-nums">{obj.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="app-card flex flex-col gap-3">
                    <h2 className="text-xl font-bold">Total to type</h2>
                    <div className="flex flex-col gap-8">
                        <BarChartTotalTypes listCardsBarChart={listCardsBarChart!} />
                        <div className="flex flex-col gap-3">
                            {[
                                { type: "Credit", label: "Credit card", bg: "bg-blue-700" },
                                { type: "Debit", label: "Debit card", bg: "bg-rose-700" },
                                { type: "Cash", label: "Cash", bg: "bg-green-700" },
                            ].map(({ type, label, bg }) => {
                                const row = listTotalToType?.find(r => r.type === type)
                                return (
                                    <div key={type} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center">
                                        <div className={`${bg} flex h-[80px] items-center rounded-xl p-3 text-[#ffffff] sm:w-[170px] sm:shrink-0`}>
                                            <p className="text-xl font-semibold">{label}</p>
                                        </div>
                                        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total money: </p>
                                                <p className="text-lg font-bold tabular-nums">{Number(row?.total_money ?? 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total moviments: </p>
                                                <p className="text-lg font-bold tabular-nums">{Number(row?.total_moviments ?? 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total incomes: </p>
                                                <p className="text-lg font-bold tabular-nums text-green-400">{Number(row?.total_incomes ?? 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-100/70">Total expenses: </p>
                                                <p className="text-lg font-bold tabular-nums text-red-400">{Number(row?.total_expenses ?? 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
