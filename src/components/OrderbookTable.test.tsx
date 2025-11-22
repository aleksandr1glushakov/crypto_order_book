import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderbookTable from './OrderbookTable';
import { OrderbookViewModel } from '../types/orderbook';


jest.mock('../utils/formatters', () => ({
    formatPrice: (value: number) => String(value),
    formatQuantity: (value: number) => String(value),
}));

const mockOrderbook: OrderbookViewModel = {
    lastUpdatedId: 1,
    bids: {
        bestPrice: 100,
        rows: [
            { price: 100, quantity: 0.5, total: 50 },
            { price: 99, quantity: 0.3, total: 29.7 },
        ],
    },
    asks: {
        bestPrice: 101,
        rows: [
            { price: 101, quantity: 0.4, total: 40.4 },
            { price: 102, quantity: 0.2, total: 20.4 },
        ],
    },
};

describe('OrderbookTable', () => {
    test('renders bids and asks rows', () => {
        render(<OrderbookTable orderbook={mockOrderbook} />);


        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('101')).toBeInTheDocument();
    });

    test('calls onPriceClick with correct side and price when clicking bid/ask price', () => {
        const onPriceClick = jest.fn();

        render(
            <OrderbookTable orderbook={mockOrderbook} onPriceClick={onPriceClick} />
        );

        const bidPriceCell = screen.getByText('100');
        const askPriceCell = screen.getByText('101');

        fireEvent.click(bidPriceCell);
        fireEvent.click(askPriceCell);

        expect(onPriceClick).toHaveBeenCalledTimes(2);
        expect(onPriceClick).toHaveBeenNthCalledWith(1, 'BUY', 100);
        expect(onPriceClick).toHaveBeenNthCalledWith(2, 'SELL', 101);
    });
});