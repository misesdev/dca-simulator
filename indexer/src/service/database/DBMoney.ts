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
            SELECT pubkey 
            FROM users 
            ORDER BY pubkey 
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

    private async upsertBetch(users: Price[]): Promise<void>
    {
        if(!users.length) return;

        const columns = [
            "pubkey", "name", "display_name", "picture", "about", "banner", "website", 
            "nip05", "lud06", "lud16", "zap_service", "created_at", "available"
        ];
        const values: any[] = [];
        const placeholders: string[] = [];
        users.forEach((user, i) => {
            const baseIndex = i * columns.length;
            placeholders.push(
                `(${columns.map((_, j) => `$${baseIndex + j + 1}`).join(", ")})`
            );
            values.push(
                true 
            )
        })
        const query = `
            INSERT INTO users (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
            ON CONFLICT (pubkey)
            DO UPDATE SET
                name = EXCLUDED.name,
                display_name = EXCLUDED.display_name,
                picture = EXCLUDED.picture,
                about = EXCLUDED.about,
                banner = EXCLUDED.banner,
                website = EXCLUDED.website,
                nip05 = EXCLUDED.nip05,
                lud06 = EXCLUDED.lud06,
                lud16 = EXCLUDED.lud16,
                zap_service = EXCLUDED.zap_service,
                updated_at = NOW(),
                available = true
        `;
        await this._db.exec(query, values);
    }

}

export default DBMoney
