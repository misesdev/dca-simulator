import { configDotenv } from "dotenv";
import MoneyService from "./src/service/MoneyService";
import cron from "node-cron"

configDotenv()

const runIndexer = async () => {
    try 
    {
        console.log("Running...");
        var service = new MoneyService()
        await service.loadPrices()
    } 
    catch (err) {
        console.error("Indexer error:", err);
    } 
    finally {
        console.log("Indexer finished");
    }
}

runIndexer()

cron.schedule("0 0 5,12,18 * * *", async () => {
    await runIndexer()
})
