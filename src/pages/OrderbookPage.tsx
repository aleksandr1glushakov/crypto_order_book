import AssetSelector from "../components/AssetSelector";
import React, {useState} from "react";
import {Asset} from "../types/trade";


const OrderbookPage: React.FC = () => {
    const [asset, setAsset] = useState<Asset>(Asset.BTC);


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
                    <h2>Order Book</h2>
                    <p>Order data will be displayed here...</p>
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