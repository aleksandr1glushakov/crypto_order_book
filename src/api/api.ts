import {ApiError, Asset, TradeRequest, TradeResponse} from "../types/trade";
import {OrderbookRaw} from "../types/orderbook";


const BASEURL: string = '';


// Orderbook API

export async function fetchOrderbookRaw(asset: Asset): Promise<OrderbookRaw> {
    const response = await fetch(`${BASEURL}/orderbook/${asset}`);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch orderbook: ${response.statusText}`
        )
    }

    const data : OrderbookRaw = await response.json();
    return data as OrderbookRaw;
}


// Trade API

export async function placeTrade(order:TradeRequest): Promise<TradeResponse> {
    const response = await fetch(`${BASEURL}/trade`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        let errorBody : ApiError | undefined;
        try{
            errorBody = (await response.json()) as ApiError;
        } catch {
            //ignore JSON parse errors
        }

        const message = errorBody?.error || `Failed to place trade: ${response.statusText}`;
        throw new Error(message);
    }

    const data : TradeResponse = await response.json();
    return data as TradeResponse;
}