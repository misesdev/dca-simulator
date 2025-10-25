import { BTCPrice } from "./types/BTCPrice";

class BTCMath 
{
    public static media(price: BTCPrice): number
    {
        return (price.low + price.high) / 2
    }
}

export default BTCMath
