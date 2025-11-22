import AssetSelector from "../components/AssetSelector";
import React, {useCallback, useState} from "react";
import {Asset, Side, TradeRequest, TradeResponse} from "../types/trade";
import { placeTrade} from "../api/api";
import OrderbookTable from "../components/OrderbookTable";
import Notification from "../components/Notification";
import OrderForm from "../components/OrderForm";
import {useOrderbook} from "../hooks/useOrderbook";


const OrderbookPage: React.FC = () => {
    const [asset, setAsset] = useState<Asset>(Asset.BTC);

    const [prefillSide, setPrefillSide] = useState<Side>(Side.BUY);
    const [prefillPrice, setPrefillPrice] = useState<number | null>(null);
    const [autoSubmitTrigger, setAutoSubmitTrigger] = useState(0);

    const { orderbook, loading, errorMsg, setErrorMsg } = useOrderbook(asset);

    const handlePlaceTrade = useCallback((order: TradeRequest): Promise<TradeResponse> =>{
        return placeTrade(order);
    },[])

    const handlePriceClick = useCallback((side: Side, price: number) => {
        setPrefillSide(side);
        setPrefillPrice(price);
        setAutoSubmitTrigger((prev)=> prev + 1)
    },[])

    return (
        <div style={{
            padding: '1rem',
            maxWidth: 1200,
            margin: '0 auto',
            height: '100vh',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h1 style={{marginBottom: '1rem'}}>Crypto Order Book</h1>

            <AssetSelector asset={asset} onChange={setAsset}/>

            {errorMsg &&(
                <Notification
                    variant='error'
                    message={errorMsg}
                    onClose={() => setErrorMsg('')}
                />
            )}

            <div style={{ flex: 1, display: 'flex', gap: '2rem', overflow: 'hidden'}}>
                {/* place for left side order book */}
                <div style={{ flex: 2, border: '1px solid #e5e7eb', padding: '1rem', overflowY: 'auto' }}>
                    {loading && !orderbook && <p>Loading orderbook...</p>}
                    {!loading && (
                        <OrderbookTable
                            orderbook={orderbook}
                            onPriceClick={handlePriceClick}
                        />
                    )}
                </div>

                {/* place for right side order entry form */}
                <div style={{ flex: 1, border: '1px solid #e5e7eb', padding: '1rem' }}>
                    <OrderForm
                        asset={asset}
                        onSubmitOrder={handlePlaceTrade}
                        initialSide={prefillSide}
                        initialPrice={prefillPrice ?? undefined}
                        autoSubmitTrigger={autoSubmitTrigger}
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderbookPage;