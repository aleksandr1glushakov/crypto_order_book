export enum Asset {BTC = 'BTC', ETH = 'ETH'}
export enum Side {BUY = 'BUY', SELL = 'SELL'}
export enum OrderType {LIMIT = 'LIMIT', MARKET = 'MARKET'}

export interface TradeRequest {
    asset: Asset;
    side: Side;
    type?: OrderType;
    quantity: number;
    price?: number;
    notional: number;
}


export interface TradeResponse extends TradeRequest {
    id: string;
    timestamp: number;
}

export interface ApiError {
    error: string;
}