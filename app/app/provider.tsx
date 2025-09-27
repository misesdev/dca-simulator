'use client'

import { ReactNode } from 'react'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
})

export default function Provider({ children }: { children: ReactNode }) {
    return (
        <>
            <ColorModeScript initialColorMode={(theme.config as any).initialColorMode} />
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </>
    )
}
