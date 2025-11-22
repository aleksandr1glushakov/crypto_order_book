export type OrderbookRaw = {
    lastUpdatedId: number;
    bids: [string, string][];
    asks: [string, string][];
}

export type OrderbookRow = {
    price: number;
    quantity: number;
    total: number;
}

export type OrderbookSide = {
    rows: OrderbookRow[];
    bestPrice: number | null;
}

export type OrderbookViewModel = {
    lastUpdatedId: number;
    bids: OrderbookSide;
    asks: OrderbookSide;
}