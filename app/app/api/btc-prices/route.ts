import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"

export async function GET(req: NextRequest) 
{
    const { searchParams } = new URL(req.url);
    const day: number = parseInt(searchParams.get("day") || "1");
    const codein: string = (searchParams.get("currency") || "BRL").trim()
    const rows = await prisma.prices.findMany({
        where: {
            day,
            codein: {
                equals: codein,
                mode: "insensitive"
            }
        },
        orderBy: [{ timestamp: "desc" }]
    })
    const prices = rows.map(price => ({
        ...price, timestamp: Number(price.timestamp)
    }))
    return NextResponse.json(prices)
}

