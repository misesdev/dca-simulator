'use client'

import useSimulation, { SimulationResultRow } from "#hooks/useSimulation"
import { 
    Flex, Heading, Table, Tbody, Td, Th, Thead, Tr, Text, Spinner, Stack, 
    Box, Container, HStack, Tag, SimpleGrid, Stat, StatLabel, StatNumber,
    StatHelpText, VStack, Divider, Icon, useBreakpointValue
} from "@chakra-ui/react"
import { FiTrendingUp, FiTrendingDown, FiClock } from "react-icons/fi"
import { useSearchParams } from "next/navigation"
import Formats from "utils/Formats"
import { useMemo } from "react"

export default function SimulatePage() 
{
    const searchParams = useSearchParams()
    const day = parseInt(searchParams.get("day") || "1", 10)
    const months = parseInt(searchParams.get("months") ?? "12")
    const value = parseFloat((searchParams.get("value") || "100")) / 100;
    const currency = (searchParams.get("currency") || "BRL").toUpperCase()

    const { 
        rows, totalCurrent, totalInvested, profitColor, profit, loading 
    } = useSimulation({ currency, months, day, value })

    const showTable = useBreakpointValue({ base: false, md: true })
    const profitLabel = useMemo(() => (profit >= 0 ? "Profit" : "Loss"), [profit])
    const profitIcon = profit >= 0 ? FiTrendingUp : FiTrendingDown
    
    if (loading) {
        return (
            <Flex align="center" justify="center" h="100vh" bg="gray.900">
                <Stack spacing={4} align="center">
                    <Spinner color="white" size="xl" />
                    <Text color="gray.300">Loading simulaion...</Text>
                </Stack>
            </Flex>
        )
    }

    return (
        <Box minH="100vh" bgGradient="linear(to-br, #0f1724, #111827)" color="white" py={{ base: 8, md: 20 }}>
            <Container maxW="6xl">
                <Stack spacing={6}>
                    <Flex align="center" justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
                        <Box>
                            <Heading size={{ base: "lg" }}>Simulation Result</Heading>
                            <Text mt={1} color="gray.300">
                                DCA — {months} months • day {day} • monthly amount {Formats.formatMoney(value, currency)}
                            </Text>
                        </Box>

                        <HStack spacing={3} pt={{ base: 2, md: 0 }}>
                            <Tag bg="blackAlpha.400" borderRadius="lg">Currency: {currency}</Tag> 
                            <Tag bg="blackAlpha.400" borderRadius="lg">Months: {months}</Tag>
                            <Tag bg="blackAlpha.400" borderRadius="lg">Day: {day}</Tag>
                        </HStack>
                    </Flex>

                    {/* Stats */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <Stat bg="blackAlpha.400" p={4} borderRadius="lg" boxShadow="md">
                            <StatLabel color="gray.300">Total Invested</StatLabel>
                            <StatNumber>{Formats.formatMoney(totalInvested, currency)}</StatNumber>
                            <StatHelpText color="gray.400">Sum of Contributions</StatHelpText>
                        </Stat>

                        <Stat bg="blackAlpha.400" p={4} borderRadius="lg" boxShadow="md">
                            <StatLabel color="gray.300">Current Value</StatLabel>
                            <StatNumber color={profitColor}>{Formats.formatMoney(totalCurrent, currency)}</StatNumber>
                            <StatHelpText color="gray.400">
                                {profitLabel} • <Box as="span" ml={2} color={profitColor}>{Formats.formatMoney(Math.abs(profit), currency)}</Box>
                            </StatHelpText>
                        </Stat>

                        <Stat bg="blackAlpha.400" p={4} borderRadius="lg" boxShadow="md">
                            <StatLabel color="gray.300">Performance</StatLabel>
                            <StatNumber display="flex" alignItems="center" gap={2}>
                                <Icon as={profitIcon} />
                                <Text as="span">{profit >= 0 ? "+" : "-"}{((Math.abs(profit) / Math.max(1, totalInvested)) * 100).toFixed(2)}%</Text>
                            </StatNumber>
                            <StatHelpText color="gray.400"><Icon as={FiClock} />Updated based on simulation</StatHelpText>
                        </Stat>
                    </SimpleGrid>

                    <Box bg="blackAlpha.500" borderRadius="xl" p={{ base: 3, md: 6 }} boxShadow="xl">
                        <Heading size="md" mb={4}>Details of Simulation</Heading>
                        {showTable ? (
                            <Box overflowX="auto">
                                <Table size="md" bg="transparent" sx={{ minWidth: 800 }}>
                                    <Thead bg="transparent">
                                        <Tr>
                                            <Th color="gray.200">Date</Th>
                                            <Th color="gray.200" textAlign="right">Invested</Th>
                                            <Th color="gray.200" textAlign="right">BTC (sats)</Th>
                                            <Th color="gray.200" textAlign="right">Current Value</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {rows.map((r: SimulationResultRow, idx: number) => (
                                            <Tr bg="transparent" key={idx} _hover={{ bg: "blackAlpha.600" }}>
                                                <Td>{Formats.formatDate(r.date)}</Td>
                                                <Td textAlign="right">{Formats.formatMoney(r.invested, currency)}</Td>
                                                <Td textAlign="right">{Formats.formatSats(r.btcAmount)}</Td>
                                                <Td textAlign="right" color={r.currentValue >= r.invested ? "green.300" : "red.300"}>
                                                    {Formats.formatMoney(r.currentValue, currency)}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                                // Mobile: cards stacked for melhor leitura
                                <VStack spacing={3} align="stretch">
                                    {rows.map((r: SimulationResultRow, idx: number) => (
                                        <Box key={idx} bg="blackAlpha.500" p={3} borderRadius="md">
                                            <Flex justify="space-between" align="center" mb={1}>
                                                <Text fontWeight="semibold">{Formats.formatDate(r.date)}</Text>
                                                <HStack>
                                                    <Text fontSize="sm" color="gray.300">
                                                        {Formats.formatSats(r.btcAmount)} 
                                                    </Text>
                                                </HStack>
                                            </Flex>

                                            <HStack justify="space-between">
                                                <Text color="gray.300" fontSize="sm">Invested</Text>
                                                <Text>{Formats.formatMoney(r.invested, currency)}</Text>
                                            </HStack>

                                            <Divider my={2} borderColor="blackAlpha.700" />

                                            <HStack justify="space-between">
                                                <Text color="gray.300" fontSize="sm">Current</Text>
                                                <Text color={r.currentValue >= r.invested ? "green.300" : "red.300"}>
                                                    {Formats.formatMoney(r.currentValue, currency)}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    ))}
                                </VStack>
                            )}
                    </Box>
                </Stack>
            </Container>
        </Box>
    )
}
