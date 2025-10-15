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
const ApiService_1 = __importDefault(require("./ApiService"));
const DBMoney_1 = __importDefault(require("./database/DBMoney"));
class MoneyService {
    constructor(dbUsers = new DBMoney_1.default(), api = new ApiService_1.default()) {
        this._dbMoney = dbUsers;
        this._api = api;
    }
    loadPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            // const prices = await this._dbMoney.list(0, 10);
            // if(prices.length)
            //     return await this.loadTodayPrice()
            yield this.loadInitialPrices();
        });
    }
    loadInitialPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            const since = this.getInitialDate();
            const prices = yield this._api.listPrices(since);
            yield this.savePrices(prices);
        });
    }
    loadTodayPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const since = new Date();
            since.setDate(since.getDate() - this._api.days);
            const prices = yield this._api.listPrices(since);
            yield this.savePrices(prices);
        });
    }
    savePrices(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const prices = new Map();
            for (let item of items) {
                prices.set(`${item.year}-${item.month}-${item.day}-${item.codein}`, item);
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
