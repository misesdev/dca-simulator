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
const axios_1 = __importDefault(require("axios"));
class ApiService {
    constructor(client = axios_1.default.create({
        baseURL: process.env.AWESOME_API_URL
    })) {
        this.days = 300;
        this._currences = ["BRL", "USD", "EUR"];
        this._client = client;
    }
    listPrices(since) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const prices = [];
            for (let codein of this._currences) {
                let today = new Date();
                let currentDate = new Date(since);
                while (today.getTime() >= currentDate.getTime()) {
                    let start_date = currentDate.toISOString();
                    start_date = start_date.replace("-", "").replace("-", "");
                    start_date = start_date.substring(0, start_date.indexOf("T"));
                    currentDate.setDate(currentDate.getDate() + this.days);
                    let end_date = currentDate.toISOString();
                    end_date = end_date.replace("-", "").replace("-", "");
                    end_date = end_date.substring(0, end_date.indexOf("T"));
                    const url = `/daily/BTC-${codein}/${this.days}?start_date=${start_date}&end_date=${end_date}`;
                    const response = yield this._client.get(url);
                    console.log(`${codein} found...:`, (_a = response.data) === null || _a === void 0 ? void 0 : _a.length);
                    if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.length) {
                        const items = response.data;
                        prices.push(...items.map(item => this.toPrice(item, codein)));
                    }
                }
            }
            return prices;
        });
    }
    toPrice(item, codein) {
        var _a, _b;
        const date = new Date(parseInt(item.timestamp) * 1000);
        const price = {
            code: "BTC", codein,
            high: (_a = item === null || item === void 0 ? void 0 : item.high) !== null && _a !== void 0 ? _a : "0.0",
            low: (_b = item === null || item === void 0 ? void 0 : item.low) !== null && _b !== void 0 ? _b : "0.0",
            timestamp: parseInt(item === null || item === void 0 ? void 0 : item.timestamp),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate() + 1
        };
        return price;
    }
}
exports.default = ApiService;
