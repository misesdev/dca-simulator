'use client'

import { useState } from 'react'
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    Text,
    VStack,
    HStack,
    Icon,
    Select,
} from '@chakra-ui/react'
import { FaBitcoin, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa'

export default function Home() {
    const [meses, setMeses] = useState(12)
    const [valor, setValor] = useState('')
    const [dia, setDia] = useState(1)
    const [moeda, setMoeda] = useState('BRL')

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '')
        const num = Number(raw) / 100
        setValor(
            num.toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda,
            })
        )
    }

    const handleSubmit = () => {
        alert(
            `Simulação:\nMeses: ${meses}\nValor: ${valor}\nDia: ${dia}\nMoeda: ${moeda}`
        )
    }

    return (
        <Flex
            minH="100vh"
            direction={{ base: 'column', md: 'row' }}
            bgGradient="linear(to-br, black, gray.900, #1a1a1a)"
            color="white"
            px={10}
            py={20}
        >
            {/* Coluna Esquerda */}
            <Flex flex="1" align="center" justify="center" p={10}>
                <VStack align="flex-start" spacing={6}>
                    <Heading
                        size="2xl"
                        bgClip="text"
                        bgGradient="linear(to-r, teal.300, green.400)"
                    >
                        DCA Simulator 
                    </Heading>
                    <Text fontSize="xl" opacity={0.8}>
                        Find out how much you would have accumulated by investing regularly in{' '}
                        <b>Bitcoin</b>.
                    </Text>
                    <Text fontSize="md" opacity={0.6}>
                        Set up your monthly contributions and see the results over time.
                    </Text>
                </VStack>
            </Flex>

            {/* Coluna Direita - Painel */}
            <Flex flex="1" align="center" justify="center">
                <Box
                    p={10}
                    w="full"
                    maxW="lg"
                >
                    <VStack spacing={6} align="stretch">
                        {/* Moeda */}
                        <FormControl>
                            <FormLabel>Fiat Currency</FormLabel>
                            <Select
                                value={moeda}
                                onChange={(e) => setMoeda(e.target.value)}
                                bg="whiteAlpha.200"
                                border="none"
                                rounded="md"
                                fontWeight="medium"
                                sx={{
                                    option: {
                                        background: '#1a1a1a',
                                        color: 'white',
                                    },
                                }}
                            >
                                <option value="USD">🇺🇸 Dólar (USD)</option>
                                <option value="BRL">🇧🇷 Real (BRL)</option>
                            </Select>
                        </FormControl>

                        {/* Meses */}
                        <FormControl>
                            <FormLabel>
                                <HStack spacing={2}>
                                    <Icon as={FaCalendarAlt} />
                                    <Text>Number of Months</Text>
                                </HStack>
                            </FormLabel>
                            <NumberInput
                                value={meses}
                                onChange={(_, v) => setMeses(v)}
                                min={1}
                                max={120}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        {/* Valor */}
                        <FormControl>
                            <FormLabel>
                                <HStack spacing={2}>
                                    <Icon as={FaMoneyBillWave} />
                                    <Text>Monthly Value</Text>
                                </HStack>
                            </FormLabel>
                            <Input
                                value={valor}
                                onChange={handleValorChange}
                                placeholder={`0,00 ${moeda}`}
                            />
                        </FormControl>

                        {/* Botão */}
                        <Button
                            w="full"
                            size="lg"
                            color="white"
                            onClick={handleSubmit}
                            transition="all 0.2s"
                        >
                            Simulate
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Flex>
    )
}
