import DBMoney from "./database/DBMoney"
import axios, { AxiosInstance } from "axios"
import { Price } from "../types";

class MoneyService
{
    private readonly _dbMoney: DBMoney;
    private readonly _client: AxiosInstance;
    private _currences = ["BRL", "USD", "EUR"];
    constructor(
        dbUsers: DBMoney = new DBMoney(),
        client: AxiosInstance = axios.create({
            baseURL: process.env.AWESOME_API_URL 
        })
    ) {
        this._dbMoney = dbUsers
        this._client = client 
    }

    public async loadPrices(): Promise<void>
    {
        const prices = await this._dbMoney.list(0, 10);
        if(prices.length)
            return await this.loadTodayPrice()
        await this.loadInitialPrices()
    }

    public async loadInitialPrices(): Promise<void> 
    {
        const days = 350
        const today = new Date()
        for(let codein of this._currences) 
        {
            const currentDate = this.getInitialDate()
            while(today >= currentDate)
            {
                let start_date = currentDate.toISOString()
                start_date = start_date.replace("-", "").replace("-", "")
                start_date = start_date.substring(0, start_date.indexOf("T"))

                currentDate.setDate(currentDate.getDate() + days)
                
                let end_date = currentDate.toISOString()
                end_date = end_date.replace("-", "").replace("-", "")
                end_date = end_date.substring(0, end_date.indexOf("T"))
            
                const url = `/daily/BTC-${codein}/${days}?start_date=${start_date}&end_date=${end_date}`
                
                const response = await this._client.get(url)
                console.log("found...:", response.data?.length)
                if(response.data?.length)
                {
                    const items = response.data as any []
                    await this.savePrices(items, codein)
                }
            }
        }
    }

    public async loadTodayPrice(): Promise<void>
    {
        const days = 10
        const date = new Date()
        date.setDate(date.getDate() - days)
        for(let codein of this._currences) 
        {
            const currentDate = date 
            let start_date = currentDate.toISOString()
            start_date = start_date.replace("-", "").replace("-", "")
            start_date = start_date.substring(0, start_date.indexOf("T"))

            currentDate.setDate(date.getDate() + days)
            
            let end_date = currentDate.toISOString()
            end_date = end_date.replace("-", "").replace("-", "")
            end_date = end_date.substring(0, end_date.indexOf("T"))
        
            const url = `/daily/BTC-${codein}/${days}?start_date=${start_date}&end_date=${end_date}`
            
            const response = await this._client.get(url)
            console.log("found...:", response.data?.length)
            if(response.data?.length) 
            {
                const items = response.data as any []
                await this.savePrices(items, codein)
            }
        }
    }
    
    private async savePrices(items: any[], codein: string): Promise<void>
    {
        const prices = new Map<string, Price>()
        for(let item of items)
        {
            if(!item?.timestamp) continue;
            const date = new Date(parseInt(item.timestamp) * 1000)
            const price: Price = {
                code: items[0]?.code ?? "BTC",
                codein: items[0]?.codein ?? codein,
                high: item?.high ?? "0.0",
                low: item?.low ?? "0.0",
                timestamp: parseInt(item?.timestamp),
                year: date.getFullYear(),
                month: date.getMonth()+1,
                day: date.getDate()+1
            }
            prices.set(`${price.year}-${price.month}-${price.day}`, price)
        }
        await this._dbMoney.upsert(Array.from(prices.values()))
    }

    private getInitialDate(): Date 
    {
        const initialDate = new Date()
        initialDate.setDate(0)
        initialDate.setMonth(0)
        initialDate.setFullYear(2012)
        initialDate.setHours(12)
        initialDate.setMinutes(0)
        return initialDate
    }
}

export default MoneyService

