"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBFactory_1 = __importDefault(require("./DBFactory"));
class DBMoney {
    constructor(db = new DBFactory_1.default()) {
        this.BATCH_SIZE = 100;
        this._db = db;
    }
    list(offset, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * 
            FROM prices 
            ORDER BY timestamp DESC 
            LIMIT $1 OFFSET $2
        `;
            const results = yield this._db.query(query, [items, offset]);
            return results;
        });
    }
    upsert(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < items.length; i += this.BATCH_SIZE) {
                const batch = items.slice(i, i + this.BATCH_SIZE);
                yield this.upsertBetch(batch);
            }
        });
    }
    upsertBetch(prices) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!prices.length)
                return;
            const columns = [
                "code", "codein", "high", "low", "timestamp", "day", "month", "year"
            ];
            const values = [];
            const placeholders = [];
            prices.forEach((price, i) => {
                const baseIndex = i * columns.length;
                placeholders.push(`(${columns.map((_, j) => `$${baseIndex + j + 1}`).join(", ")})`);
                values.push(price.code, price.codein, price.high, price.low, price.timestamp, price.day, price.month, price.year);
            });
            const query = `
            INSERT INTO prices (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
            ON CONFLICT (year, month, day, codein)
            DO UPDATE SET
                high = EXCLUDED.high,
                low = EXCLUDED.low,
                timestamp = EXCLUDED.timestamp;
        `;
            yield this._db.exec(query, values);
        });
    }
}
exports.default = DBMoney;
