import { prisma } from "../../lib/prisma"
import { Flex, Heading, Table, Tbody, Td, Th, Thead, Tr, Text } from "@chakra-ui/react"
import { format } from "date-fns"

interface Props {
    searchParams: {
        currency?: string
        months?: string
        value?: string
        day?: string
    }
}

const SimulatePage = async ({ searchParams }: Props) => {

    const day = parseInt(searchParams.day||"1", 10)
    const months = parseInt(searchParams.months??"12")
    const value = parseFloat((searchParams.value || "100").replace(/[^\d.-]/g, ""))
    const currency = (searchParams.currency || "BRL").toUpperCase()

    // 📊 Busca preços do banco
    // (últimos X meses a partir de hoje)
    const today = new Date()
    const start = new Date(today)
    start.setMonth(start.getMonth() - months)

    const prices = await prisma.prices.findMany({
        where: {
            year: { gte: start.getFullYear() },
            code: "BTC",
            codein: currency,
        },
        orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }],
    })

    // 🔢 Calcula aportes
    const rows: {
        date: Date
        invested: number
        btcAmount: number
        currentValue: number
    }[] = []

    let totalInvested = 0
    let totalCurrent = 0

    for (let i = 0; i < months; i++) {
        const date = new Date(today)
        date.setMonth(today.getMonth() - i)
        date.setDate(day)

        const row = prices.find(
            (p) => p.year === date.getFullYear() && p.month === date.getMonth() + 1 && p.day === date.getDate()
        )

        if (!row) continue

        const price = parseFloat(row.low) // preço de compra (poderia usar avg de high/low)
        const btcAmount = value / price
        const currentPrice = parseFloat(row.high)
        const currentValue = btcAmount * currentPrice

        totalInvested += value
        totalCurrent += currentValue

        rows.push({
            date,
            invested: value,
            btcAmount,
            currentValue,
        })
    }

    const profit = totalCurrent - totalInvested
    const profitColor = profit >= 0 ? "green.400" : "red.400"

    return (
        <Flex
            direction="column"
            minH="100vh"
            px={10}
            py={20}
            bgGradient="linear(to-br, black, gray.900, #1a1a1a)"
            color="white"
        >
            {/* Header */}
            <Heading size="2xl" mb={4}>
                Simulation Result
            </Heading>

            <Text fontSize="xl">
                Total Invested: <b>${totalInvested.toFixed(2)}</b>
            </Text>
            <Text fontSize="xl" color={profitColor} mb={8}>
                Current Value: <b>${totalCurrent.toFixed(2)}</b> ({profit >= 0 ? "Profit" : "Loss"})
            </Text>

            {/* Table */}
            <Table variant="simple" size="md" bg="blackAlpha.600" rounded="xl" overflow="hidden">
                <Thead bg="blackAlpha.700">
                    <Tr>
                        <Th color="white">Date</Th>
                        <Th color="white">Invested</Th>
                        <Th color="white">BTC (sats)</Th>
                        <Th color="white">Current Value</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((r, idx) => (
                        <Tr key={idx}>
                            <Td>{format(r.date, "yyyy-MM-dd")}</Td>
                            <Td>${r.invested.toFixed(2)}</Td>
                            <Td>{(r.btcAmount * 1e8).toFixed(0)}</Td>
                            <Td color={r.currentValue >= r.invested ? "green.300" : "red.300"}>
                                ${r.currentValue.toFixed(2)}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Flex>
    )
}

export default SimulatePage
