import { configDotenv } from "dotenv";

configDotenv()

var shutdown = false;
var nextRun: NodeJS.Timeout | null = null;

const gracefulShutdown = async () => {
    if (shutdown) return; 
    shutdown = true;

    console.log("\nclosing connections ...");

    try 
    {
        if (nextRun) clearTimeout(nextRun);
    } 
    catch (err) {
        console.error("Erro ao encerrar pool:", err);
    } 
    finally {
        process.exit(0);
    }
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const runIndexer = async () => {
    try 
    {
        console.log("Running indexer...");
        // indexer 
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
}

runIndexer()



