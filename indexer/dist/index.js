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
const dotenv_1 = require("dotenv");
const MoneyService_1 = __importDefault(require("./src/service/MoneyService"));
(0, dotenv_1.configDotenv)();
var shutdown = false;
var nextRun = null;
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    if (shutdown)
        return;
    shutdown = true;
    console.log("\nclosing connections ...");
    try {
        if (nextRun)
            clearTimeout(nextRun);
    }
    catch (err) {
        console.error("Erro ao encerrar pool:", err);
    }
    finally {
        process.exit(0);
    }
});
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
const runIndexer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running...");
        var service = new MoneyService_1.default();
        yield service.loadPrices();
    }
    catch (err) {
        console.error("Indexer error:", err);
    }
    finally {
        if (!shutdown) // execute only is not shutdown 
         {
            console.log("Indexer finished. Next run tomorow");
            nextRun = setTimeout(runIndexer, 60 * 60 * 24 * 1000);
        }
    }
});
runIndexer();
