import AssetSelector from "../components/AssetSelector";
import React, {useEffect, useState} from "react";
import {Asset} from "../types/trade";
import {OrderbookViewModel} from "../types/orderbook";
import {fetchOrderbook} from "../api/api";
import OrderbookTable from "../components/OrderbookTable";


const OrderbookPage: React.FC = () => {
    const [asset, setAsset] = useState<Asset>(Asset.BTC);
    const [orderbook, setOrderbook] = useState<OrderbookViewModel | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        let isMounted = true;

        const load = async () =>{
            setLoading(true);
            try{
                const data = await fetchOrderbook(asset);
                if (isMounted) {
                    setOrderbook(data);
                }
            } catch (error) {
                console.error('Failed to load orderbook' , error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // initial load
        load();

        return () => {
            isMounted = false;
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