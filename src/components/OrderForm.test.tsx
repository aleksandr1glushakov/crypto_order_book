import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import OrderForm from './OrderForm';
import {Asset, OrderType, Side, TradeRequest, TradeResponse} from '../types/trade';

describe('OrderForm', () => {
    test('shows error when quantity is zero or negative', async () => {
        const mockSubmit = jest.fn<Promise<TradeResponse>, [TradeRequest]>(() =>
            Promise.resolve({
                asset: Asset.BTC,
                side: Side.BUY,
                type: OrderType.LIMIT,
                price: 20000,
                quantity: 0,
                notional: 0,
                id: '1',
                timestamp: Date.now(),
            })
        );

        render(<OrderForm asset={Asset.BTC} onSubmitOrder={mockSubmit} />);


        const priceInput = screen.getByLabelText(/^price:/i);
        const quantityInput = screen.getByLabelText(/^quantity/i);
        const notionalInput = screen.getByLabelText(/^notional/i);

        fireEvent.change(priceInput, { target: { value: '20000' } });
        fireEvent.change(quantityInput, { target: { value: '0' } });
        fireEvent.change(notionalInput, { target: { value: '0' } });

        const submitButton = screen.getByRole('button', { name: /place limit order/i });
        fireEvent.click(submitButton);


        expect(await screen.findByText(/quantity must be > 0/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    test('calls onSubmitOrder with correct payload when form is valid', async () => {
        const mockSubmit = jest.fn<Promise<TradeResponse>, [TradeRequest]>((order) =>
            Promise.resolve({
                ...order,
                id: 'order-123',
                timestamp: 1234567890,
            })
        );

        render(<OrderForm asset={Asset.BTC} onSubmitOrder={mockSubmit} />);

        const sideSelect = screen.getByLabelText(/side/i);
        const priceInput = screen.getByLabelText(/^price:/i);
        const quantityInput = screen.getByLabelText(/^quantity/i);
        const notionalInput = screen.getByLabelText(/^notional/i);


        fireEvent.change(sideSelect, { target: { value: 'SELL' } });
        fireEvent.change(priceInput, { target: { value: '20000' } });
        fireEvent.change(quantityInput, { target: { value: '0.1' } });
        fireEvent.change(notionalInput, { target: { value: '2000' } });

        const submitButton = screen.getByRole('button', { name: /place limit order/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledTimes(1);
        });

        const calledWith = mockSubmit.mock.calls[0][0];
        expect(calledWith.asset).toBe('BTC');
        expect(calledWith.side).toBe('SELL');
        expect(calledWith.type).toBe('LIMIT');
        expect(calledWith.price).toBe(20000);
        expect(calledWith.quantity).toBe(0.1);
        expect(calledWith.notional).toBe(2000);
    });
});