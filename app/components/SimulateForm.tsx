'use client'
import {
    Button,
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
import { useState } from 'react';
import { FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"


export type SimulateParams = {
    currency: string;
    months: number;
    value: string;
    day: number;
}

interface SimulateFormProps {
    handleSubmit: (params: SimulateParams) => void;
}

const SimulateForm = ({ handleSubmit }: SimulateFormProps) => {

    const [day, setDay] = useState(1)
    const [months, setMonths] = useState(12)
    const [value, setValue] = useState('')
    const [currency, setCurrency] = useState('BRL')

    const handleValorChange = (value: string) => {
        const raw = value.replace(/\D/g, '')
        const num = Number(raw) / 100
        setValue(
            num.toLocaleString('pt-BR', {
                style: 'currency',
                currency: currency,
            })
        )
    }


    return (
        <VStack flex={1} maxW={400} spacing={6} align="stretch">
            {/* Moeda */}
            <FormControl>
                <FormLabel>Fiat Currency</FormLabel>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
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
                    value={months}
                    onChange={(_, v) => setMonths(!!v ? v : 0)}
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
                    min={1}
                    max={120}
                >
                    <NumberInputField border="hidden" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl>
                <FormLabel>
                    <HStack spacing={2}>
                        <Icon as={FaCalendarAlt} />
                        <Text>Day of Month</Text>
                    </HStack>
                </FormLabel>
                <NumberInput
                    value={day}
                    onChange={(_, v) => setDay(!!v ? v : 1)}
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
                    min={1}
                    max={28}
                >
                    <NumberInputField border="hidden" />
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
                    value={value}
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
                    onChange={(e) => handleValorChange(e.target.value)}
                    placeholder={`0,00 ${currency}`}
                />
            </FormControl>

            {/* Botão */}
            <Button
                w="full"
                size="lg"
                color="white"
                onClick={() => handleSubmit({ months, value, day, currency })}
                bgGradient="linear(to-r, teal.700, green.600)"
                _hover={""}
                transition="all 0.2s"
            >
                Simulate
            </Button>
        </VStack>
    )
}

export default SimulateForm
