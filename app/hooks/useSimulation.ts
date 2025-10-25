'use client'

import { useEffect, useState } from "react"
import ApiService from "services/ApiService"
import BTCMath from "services/BTCMath"

export type SimulationResultRow = {
    date: Date
    invested: number
    btcAmount: number
    currentValue: number
}

type SimulateParams = {
    currency: string;
    months: number;
    value: number;
    day: number;
}

const useSimulation = ({ months, day, currency, value }: SimulateParams) => {
    
    const [rows, setRows] = useState<SimulationResultRow[]>([])
    const [totalInvested, setTotalInvested] = useState(0)
    const [totalCurrent, setTotalCurrent] = useState(0)
    const [mediaPrice, setMediaPrice] = useState(0)
    const [profit, setProfit] = useState(0)
    const [profitColor, setProfitColor] = useState("white")
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadSimulation() }, [])

    const loadSimulation = async () => {
        try {
            setLoading(true)

            const service = new ApiService()
            const currentPrice = await service.getPrice(currency) 
            const prices = await service.listPrices(currency, day, months)

            let currentSum = 0
            let investedSum = 0
            const today = new Date()
            const newRows: SimulationResultRow[] = []

            for (let i = 0; i < months; i++) 
            {
                const date = new Date(today)
                date.setMonth(today.getMonth() - i)
                date.setDate(day)

                const priceRow = prices.find((p) =>
                        p.year === date.getFullYear() &&
                        p.month === date.getMonth() + 1 &&
                        p.day === date.getDate()
                )

                if (!priceRow) continue
       
                const avgPrice = BTCMath.media(priceRow)

                const btcAmount = value / avgPrice 

                const currentValue = btcAmount * BTCMath.media(currentPrice)

                currentSum += currentValue
                investedSum += value

                newRows.push({
                    date,
                    invested: value,
                    currentValue,
                    btcAmount
                })
            }

            setMediaPrice(investedSum / months)
            setTotalInvested(investedSum)
            setTotalCurrent(currentSum)
            setRows(newRows)

            const profit = currentSum - investedSum
            setProfitColor(profit >= 0 ? "green.400" : "red.400")
            setProfit(profit)
        } 
        catch (err) {
            console.error("Erro ao carregar simulação:", err)
        }
        finally {
            setLoading(false)
        }
    }

    return {
        rows,
        loading,
        totalCurrent,
        totalInvested,
        mediaPrice,
        profitColor,
        profit
    }
}

export default useSimulation
