import {ApiError, Asset, TradeRequest, TradeResponse} from "../types/trade";
import {OrderbookRaw, OrderbookRow, OrderbookSide, OrderbookViewModel} from "../types/orderbook";


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

function mapSide(rawSide: [string, string][]): OrderbookSide {
    const rows: OrderbookRow[] = rawSide.map(([priceStr, qtyStr])=> {
        const price = Number (priceStr);
        const quantity = Number(qtyStr);
        return{
            price,
            quantity,
            total: price*quantity,
        };
    });

    const bestPrice = rows.length > 0 ? rows[0].price : null;

    return {rows, bestPrice};
}

export async function fetchOrderbook(asset: Asset): Promise<OrderbookViewModel> {
    const raw = await fetchOrderbookRaw(asset);

    const bidsSorted = [...raw.bids].sort(
        (a,b) => Number(a[0]) - Number(b[0])
    );

    const asksSorted = [...raw.asks].sort(
        (a,b) => Number(a[0]) - Number(b[0])
    );

    return {
        lastUpdatedId: raw.lastUpdatedId,
        bids: mapSide(bidsSorted),
        asks: mapSide(asksSorted),
    };
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