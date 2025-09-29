import { Price } from "../../types"
import DBFactory from "./DBFactory"

class DBMoney
{
    private BATCH_SIZE = 100
    private readonly _db: DBFactory
    constructor(
        db: DBFactory = new DBFactory(),
    ) {
        this._db = db
    }

    public async list(offset: number, items: number): Promise<Price[]>
    {
        const query = `
            SELECT * 
            FROM prices 
            ORDER BY timestamp DESC 
            LIMIT $1 OFFSET $2
        `
        const results = await this._db.query<Price>(query, [items, offset])
        return results 
    }

    public async upsert(items: Price[]): Promise<void>
    {
        for (let i = 0; i < items.length; i += this.BATCH_SIZE) 
        {
            const batch = items.slice(i, i + this.BATCH_SIZE);
            await this.upsertBetch(batch);
        }
    }

    private async upsertBetch(prices: Price[]): Promise<void>
    {
        if(!prices.length) return;

        const columns = [
            "code", "codein", "high", "low", "timestamp", "day", "month", "year"
        ];
        const values: any[] = [];
        const placeholders: string[] = [];
        prices.forEach((price, i) => {
            const baseIndex = i * columns.length;
            placeholders.push(
                `(${columns.map((_, j) => `$${baseIndex + j + 1}`).join(", ")})`
            );
            values.push(
                price.code,
                price.codein,
                price.high,
                price.low,
                price.timestamp,
                price.day,
                price.month,
                price.year
            )
        })
        const query = `
            INSERT INTO prices (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
            ON CONFLICT (year, month, day)
            DO UPDATE SET
                code = EXCLUDED.code,
                codein = EXCLUDED.codein,
                high = EXCLUDED.high,
                low = EXCLUDED.low,
                timestamp = EXCLUDED.timestamp;
        `;
        await this._db.exec(query, values);
    }

    public async clear(): Promise<void>
    {
        const query = `
            DELETE FROM prices;
        `;
        await this._db.exec(query, null);
    }

}

export default DBMoney
