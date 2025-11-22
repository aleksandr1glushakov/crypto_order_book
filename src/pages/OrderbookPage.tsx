import AssetSelector from "../components/AssetSelector";
import React, {useEffect, useState} from "react";
import {Asset, Side, TradeRequest, TradeResponse} from "../types/trade";
import {OrderbookViewModel} from "../types/orderbook";
import {fetchOrderbook, placeTrade} from "../api/api";
import OrderbookTable from "../components/OrderbookTable";
import Notification from "../components/Notification";
import OrderForm from "../components/OrderForm";


const OrderbookPage: React.FC = () => {
    const [asset, setAsset] = useState<Asset>(Asset.BTC);
    const [orderbook, setOrderbook] = useState<OrderbookViewModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const REFRESH_INTERVAL_MS = 5000;

    const [prefillSide, setPrefillSide] = useState<Side>(Side.BUY);
    const [prefillPrice, setPrefillPrice] = useState<number | null>(null);
    const [autoSubmitTrigger, setAutoSubmitTrigger] = useState(0);

    useEffect(()=>{
        let isMounted = true;

        const load = async () =>{
            setLoading(true);
            setErrorMsg('');
            try{
                const data = await fetchOrderbook(asset);
                if (isMounted) {
                    setOrderbook(data);
                }
            } catch (error) {
                if(isMounted){
                    setErrorMsg(error instanceof Error ? error.message : 'Failed to load orderbook');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // initial load
        load();

        // polling
        const interval = setInterval(()=>{
            load();
        }, REFRESH_INTERVAL_MS)

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [asset])

    const handlePlaceTrade = (order: TradeRequest): Promise<TradeResponse> =>{
        return placeTrade(order);
    }

    const handlePriceClick = (side: Side, price: number) => {
        setPrefillSide(side);
        setPrefillPrice(price);
        setAutoSubmitTrigger((prev)=> prev + 1)
    };

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