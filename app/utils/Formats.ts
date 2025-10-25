import { format } from "date-fns"

class Formats
{
    static formatMoney(value: number, currency: string): string
    {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: currency
        })
    }

    static formatSats(value: number): string
    {
        const sats = Math.round((value * 1e8) / 100)
        return `${sats.toLocaleString("pt-BR")} sats`
    }

    static formatDate(date: Date): string
    {
        return format(date, "dd/MM/yyyy")
    }
}

export default Formats

