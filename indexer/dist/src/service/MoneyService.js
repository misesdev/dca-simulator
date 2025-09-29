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
const DBMoney_1 = __importDefault(require("./database/DBMoney"));
const axios_1 = __importDefault(require("axios"));
class MoneyService {
    constructor(dbUsers = new DBMoney_1.default(), client = axios_1.default.create({
        baseURL: process.env.AWESOME_API_URL
    })) {
        this._currences = ["BRL", "USD", "EUR"];
        this._dbMoney = dbUsers;
        this._client = client;
    }
    loadPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this._dbMoney.clear()
            // const prices = await this._dbMoney.list(0, 10);
            // if(prices.length)
            //     return await this.loadTodayPrice()
            yield this.loadInitialPrices();
        });
    }
    loadInitialPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const days = 350;
            const today = new Date();
            for (let codein of this._currences) {
                const currentDate = this.getInitialDate();
                while (today >= currentDate) {
                    let start_date = currentDate.toISOString();
                    start_date = start_date.replace("-", "").replace("-", "");
                    start_date = start_date.substring(0, start_date.indexOf("T"));
                    currentDate.setDate(currentDate.getDate() + days);
                    let end_date = currentDate.toISOString();
                    end_date = end_date.replace("-", "").replace("-", "");
                    end_date = end_date.substring(0, end_date.indexOf("T"));
                    const url = `/daily/BTC-${codein}/${days}?start_date=${start_date}&end_date=${end_date}`;
                    const response = yield this._client.get(url);
                    console.log("found...:", (_a = response.data) === null || _a === void 0 ? void 0 : _a.length);
                    if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.length) {
                        const items = response.data;
                        //console.log(end_date, "saving", items.length, "prices for", codein)
                        yield this.savePrices(items, codein);
                    }
                }
            }
        });
    }
    loadTodayPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const days = 10;
            const date = new Date();
            date.setDate(date.getDate() - days);
            for (let codein of this._currences) {
                const currentDate = date;
                let start_date = currentDate.toISOString();
                start_date = start_date.replace("-", "").replace("-", "");
                start_date = start_date.substring(0, start_date.indexOf("T"));
                currentDate.setDate(date.getDate() + days);
                let end_date = currentDate.toISOString();
                end_date = end_date.replace("-", "").replace("-", "");
                end_date = end_date.substring(0, end_date.indexOf("T"));
                const url = `/daily/BTC-${codein}/${days}?start_date=${start_date}&end_date=${end_date}`;
                const response = yield this._client.get(url);
                if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.length) {
                    const items = response.data;
                    console.log(end_date, "saving", items.length, "prices for", codein);
                    yield this.savePrices(items, codein);
                }
            }
        });
    }
    savePrices(items, codein) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const prices = new Map();
            for (let item of items) {
                if (!(item === null || item === void 0 ? void 0 : item.timestamp))
                    continue;
                const date = new Date(parseInt(item.timestamp) * 1000);
                const price = {
                    code: (_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : "BTC",
                    codein: (_d = (_c = items[0]) === null || _c === void 0 ? void 0 : _c.codein) !== null && _d !== void 0 ? _d : codein,
                    high: (_e = item === null || item === void 0 ? void 0 : item.high) !== null && _e !== void 0 ? _e : "0.0",
                    low: (_f = item === null || item === void 0 ? void 0 : item.low) !== null && _f !== void 0 ? _f : "0.0",
                    timestamp: parseInt(item === null || item === void 0 ? void 0 : item.timestamp),
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate() + 1
                };
                prices.set(`${price.year}-${price.month}-${price.day}`, price);
            }
            yield this._dbMoney.upsert(Array.from(prices.values()));
        });
    }
    getInitialDate() {
        const initialDate = new Date();
        initialDate.setDate(0);
        initialDate.setMonth(0);
        initialDate.setFullYear(2012);
        initialDate.setHours(12);
        initialDate.setMinutes(0);
        return initialDate;
    }
}
exports.default = MoneyService;
