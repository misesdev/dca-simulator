import { Price } from "../types";
import ApiService from "./ApiService";
import DBMoney from "./database/DBMoney"

class MoneyService
{
    private readonly _api: ApiService;
    private readonly _dbMoney: DBMoney;
    constructor(
        dbUsers: DBMoney = new DBMoney(),
        api: ApiService = new ApiService()
    ) {
        this._dbMoney = dbUsers
        this._api = api
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
        const since = this.getInitialDate()
        const prices = await this._api.listPrices(since) 
        await this.savePrices(prices)
    }

    public async loadTodayPrice(): Promise<void>
    {
        const since = new Date()
        since.setDate(since.getDate() - this._api.days)
        const prices = await this._api.listPrices(since) 
        await this.savePrices(prices)
    }
    
    private async savePrices(items: Price[]): Promise<void>
    {
        const prices = new Map<string, Price>()
        for(let item of items)
        {
            prices.set(`${item.year}-${item.month}-${item.day}-${item.codein}`, item)
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

