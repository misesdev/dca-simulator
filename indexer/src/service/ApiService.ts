import axios, { AxiosInstance } from "axios";
import { Price } from "../types";

class ApiService 
{   
    public readonly days = 300
    private readonly _client: AxiosInstance;
    private _currences = ["BRL", "USD", "EUR"];
    constructor(
        client: AxiosInstance = axios.create({
            baseURL: process.env.AWESOME_API_URL 
        })
    )
    {
        this._client = client 
    }

    public async listPrices(since: Date): Promise<Price[]>
    {
        const prices: Price[] = [] 
        for(let codein of this._currences) 
        {
            let today = new Date()
            let currentDate = new Date(since)
            while(today.getTime() >= currentDate.getTime())
            {
                let start_date = currentDate.toISOString()
                start_date = start_date.replace("-", "").replace("-", "")
                start_date = start_date.substring(0, start_date.indexOf("T"))

                currentDate.setDate(currentDate.getDate() + this.days)
                
                let end_date = currentDate.toISOString()
                end_date = end_date.replace("-", "").replace("-", "")
                end_date = end_date.substring(0, end_date.indexOf("T"))
            
                const url = `/daily/BTC-${codein}/${this.days}?start_date=${start_date}&end_date=${end_date}`
                
                const response = await this._client.get(url)
                console.log(`${codein} found...:`, response.data?.length)

                if(response.data?.length)
                {
                    const items = response.data as any[]
                    prices.push(...items.map(item => this.toPrice(item, codein)))
                }
            }
        }
        return prices
    }  

    private toPrice(item: any, codein: string): Price
    {
        const date = new Date(parseInt(item.timestamp) * 1000)
        const price: Price = {
            code: "BTC", codein,
            high: item?.high ?? "0.0",
            low: item?.low ?? "0.0",
            timestamp: parseInt(item?.timestamp),
            year: date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()+1
        }
        return price
    }
}

export default ApiService
