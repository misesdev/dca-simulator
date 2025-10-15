import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"

export async function GET(req: NextRequest) 
{
    const date = new Date()
    const { searchParams } = new URL(req.url);
    const codein = (searchParams.get("currency") || "BRL")
        .toLowerCase().trim();
    const prices = await prisma.prices.findMany({
        where: {
            day: date.getDate()-1,
            month: date.getMonth()+1, 
            year: date.getFullYear(),
            codein: {
                equals: codein,
                mode: "insensitive"
            }
        }
    })
    if(prices.length) {
        return NextResponse.json({
            ...prices[0], timestamp: Number(prices[0].timestamp)
        })
    }
    return NextResponse.json(null)
}

