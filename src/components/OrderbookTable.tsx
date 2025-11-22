import React from "react";
import {OrderbookRow, OrderbookViewModel} from "../types/orderbook";
import {formatPrice, formatQuantity} from "../utils/formatters";
import {Side} from "../types/trade";


interface OrderbookTableProps {
    orderbook: OrderbookViewModel | null;
    onPriceClick?: (side: Side, price: number) => void;
}

const headerCellStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: 12,
    fontWeight: 600,
    borderBottom: '1px solid #e5e7eb',
};

const cellStyle: React.CSSProperties = {
    padding: '2px 8px',
    fontSize: 12,
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
};

const OrderbookTable: React.FC<OrderbookTableProps> = ({orderbook, onPriceClick}) => {
    if(!orderbook) {
        return(
            <div>No Order Book data</div>
        )
    }

    return(
        <div>
            <h2 style={{marginBottom: '0.5rem'}}>Order Book</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
                {/* Bids */}
                <table style={{ flex: 1, borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={headerCellStyle}>Bid Price</th>
                        <th style={headerCellStyle}>Quantity</th>
                        <th style={headerCellStyle}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderbook.bids.rows.map((row: OrderbookRow, idx: number) => (
                        <tr key={`bid-${idx}`}>
                            <td style={{
                                ...cellStyle,
                                color: '#16a34a',
                                cursor: onPriceClick ? 'pointer' : 'default',
                            }}
                                onClick={() => onPriceClick?.(Side.BUY, row.price)}
                            >
                                {formatPrice(row.price)}
                            </td>
                            <td style={cellStyle}>{formatQuantity(row.quantity)}</td>
                            <td style={cellStyle}>{formatPrice(row.total)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Asks */}
                <table style={{ flex: 1, borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={headerCellStyle}>Ask Price</th>
                        <th style={headerCellStyle}>Quantity</th>
                        <th style={headerCellStyle}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderbook.asks.rows.map((row: OrderbookRow, idx: number) => (
                        <tr key={`ask-${idx}`}>
                            <td style={{
                                ...cellStyle,
                                color: '#dc2626',
                                cursor: onPriceClick ? 'pointer' : 'default',
                            }}
                                onClick={() => onPriceClick?.(Side.SELL, row.price)}
                            >
                                {formatPrice(row.price)}
                            </td>
                            <td style={cellStyle}>{formatQuantity(row.quantity)}</td>
                            <td style={cellStyle}>{formatPrice(row.total)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default React.memo(OrderbookTable);