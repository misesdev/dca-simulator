'use client'

import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import SimulateForm, { SimulateParams } from '#components/SimulateForm'
import { useRouter } from 'next/navigation'

export default function Home() {

    const router = useRouter()

    const handleSubmit = (params: SimulateParams) => {
        const { currency, months, value, day } = params
        router.push(`/simulate?currency=${currency}&months=${months}&day=${day}&value=${value}`)
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
            <Flex flex="1" align="center" justify="center" py={10}>
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

            <Flex flex="1" align="center" justify="center" py={10}>
                <SimulateForm handleSubmit={handleSubmit} />
            </Flex>
        </Flex>
    )
}
