import AssetSelector from "../components/AssetSelector";
import React, {useEffect, useState} from "react";
import {Asset} from "../types/trade";
import {OrderbookViewModel} from "../types/orderbook";
import {fetchOrderbook} from "../api/api";
import OrderbookTable from "../components/OrderbookTable";
import Notification from "../components/Notification";


const OrderbookPage: React.FC = () => {
    const [asset, setAsset] = useState<Asset>(Asset.BTC);
    const [orderbook, setOrderbook] = useState<OrderbookViewModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const REFRESH_INTERVAL_MS = 5000;


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
                        <OrderbookTable orderbook={orderbook}/>
                    )}
                </div>

                {/* place for right side order entry form */}
                <div style={{ flex: 1, border: '1px solid #e5e7eb', padding: '1rem' }}>
                    <h2>Order Entry</h2>
                    <p>Order entry form will be added here...</p>
                </div>
            </div>
        </div>
    )
}

export default OrderbookPage;