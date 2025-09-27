import DBMoney from "./database/DBMoney"

class MoneyService
{
    private readonly _dbMoney: DBMoney
    constructor(
        dbUsers: DBMoney = new DBMoney(),
    ) {
        this._dbMoney = dbUsers
    }

    public async loadPrices(): Promise<void>
    {

    }

    public async loadInitialData(): Promise<void> 
    {

    }

    public async loadTodayMoney(): Promise<void>
    {

    }

}

export default MoneyService

