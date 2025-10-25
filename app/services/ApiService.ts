import { BTCPrice } from "./types/BTCPrice"

class ApiService 
{
    public async getPrice(currency: string): Promise<BTCPrice>
    {
        const response = await fetch(`/api/btc-price?currency=${currency}`)
        if(response.ok) 
        {
            const item = await response.json()
            return {
                day: item.day,
                month: item.month,
                year: item.year,
                timestamp: item.timestamp,
                codein: item.codein,
                high: (parseFloat(item.high) / 100),
                low: (parseFloat(item.low) / 100)
            }
        }
        return {} as BTCPrice
    }

    public async listPrices(currency: string, day: number, months: number = 12): Promise<BTCPrice[]>
    {
        const prices: BTCPrice[] = []
        const response = await fetch(`/api/btc-prices?currency=${currency}&day=${day}`)
        if(response.ok) 
        {
            const results = await response.json()
            prices.push(...results.map((item: any) => {
                return {
                    day: item.day,
                    month: item.month,
                    year: item.year,
                    timestamp: item.timestamp,
                    codein: item.codein,
                    high: (parseFloat(item.high) / 100),
                    low: (parseFloat(item.low) / 100)
                }
            }))
        }
        return prices.slice(0, months) 
    }
}

export default ApiService
