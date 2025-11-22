import {Asset} from "../types/trade";
import React from "react";


interface AssetSelectorProps {
    asset: Asset;
    onChange: (asset: Asset) => void;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({asset, onChange}) => {
    return (
        <div style={{marginBottom: '1rem'}}>
            <label htmlFor='asset-selector'>
                Asset:&nbsp;
                <select
                    id='asset-selector'
                    value={asset}
                    onChange={(e)=>onChange(e.target.value as Asset)}
                >
                    <option value={Asset.BTC}>{Asset.BTC}</option>
                    <option value={Asset.ETH}>{Asset.ETH}</option>
                </select>
            </label>
        </div>
    )
}

export default AssetSelector;