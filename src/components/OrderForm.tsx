import {Asset, OrderType, Side, TradeRequest, TradeResponse} from "../types/trade";
import React, { useEffect, useState} from "react";
import Notification from "./Notification";


interface OrderFormProps {
    asset: Asset;
    onSubmitOrder: (order: TradeRequest) => Promise<TradeResponse>;
}

type FormState = {
    side: Side;
    price: string;
    quantity: string;
    notional: string;
};

type LastEdited = 'quantity' | 'notional' | null;


const OrderForm: React.FC<OrderFormProps> = ({asset, onSubmitOrder}) => {
    const [form, setForm] = useState<FormState>({
        side: Side.BUY,
        price: '',
        quantity: '',
        notional: '',
    });

    const [lastEdited, setLastEdited] = useState<LastEdited>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(()=>{
        const priceNum = Number(form.price) || 0;
        if(priceNum <= 0) return;

        if(lastEdited === 'quantity'){
            const qty = Number(form.quantity) || 0;
            if(qty > 0) {
                const notional = qty * priceNum;
                setForm((prev) => ({...prev, notional: String(notional)}))
            }
        } else if (lastEdited === 'notional') {
            const notionalNum = Number(form.notional) || 0;
            if(notionalNum > 0){
                const qty = notionalNum / priceNum;
                setForm((prev) =>({...prev, quantity: String(qty)}))
            }
        }

    }, [form.price, form.quantity, form.notional, lastEdited])

    const handleChange = (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const value = e.target.value;

            setForm((prev) => ({...prev, [field]: value}));

            if(field === 'quantity') setLastEdited('quantity');
            if(field === 'notional') setLastEdited('notional');
        }

    const handleSideChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const value = e.target.value as Side;
        setForm((prev) => ({...prev, side: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        const priceNum = Number(form.price);
        const qtyNum = Number(form.quantity);
        const notionalNum = Number(form.notional);

        if(!priceNum || priceNum <= 0) {
            setErrorMsg('Price must be greater than 0 for a LIMIT order.');
            return;
        }
        if(!qtyNum || qtyNum <= 0) {
            setErrorMsg('Quantity must be greater than 0.');
            return;
        }
        if(!notionalNum || notionalNum <= 0) {
            setErrorMsg('Notional must be greater than 0.');
            return;
        }

        const payload: TradeRequest = {
            asset,
            side: form.side,
            type: OrderType.LIMIT,
            price: priceNum,
            quantity: qtyNum,
            notional: notionalNum,
        };

        try {
            setSubmitting(true);
            const response = await onSubmitOrder(payload);
            setSuccessMsg(`Order placed successfully (id=${response.id}, side=${response.side}, qty=${response.quantity}).`);
            setForm((prev)=> ({
                ...prev,
                quantity: '',
                notional: '',
            }));
        } catch (err) {
            if(err instanceof Error){
                setErrorMsg(err.message);
            } else {
                setErrorMsg('Unknown error placing order.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Order Entry</h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxWidth: 320,
                }}
            >
                <div>
                    <label htmlFor={'side-select'}>
                        Side:&nbsp;
                        <select name='side-select' id='side-select' onChange={handleSideChange}>
                            <option value={Side.BUY}>{Side.BUY}</option>
                            <option value={Side.SELL}>{Side.SELL}</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label htmlFor={'price-input'}>
                        Price:&nbsp;
                        <input
                            id='price-input'
                            type='number'
                            step='0.01'
                            min='0.01'
                            value={form.price}
                            onChange={handleChange('price')}
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor={'quantity-input'}>
                        Quantity:&nbsp;
                        <input
                            id='quantity-input'
                            type='number'
                            step='0.000001'
                            min='0.000001'
                            value={form.quantity}
                            onChange={handleChange('quantity')}
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor={'notional-input'}>
                        Notional (price x quantity):&nbsp;
                        <input
                            id='notional-input'
                            type='number'
                            step='0.000001'
                            min='0.000001'
                            value={form.notional}
                            onChange={handleChange('notional')}
                        />
                    </label>
                </div>

                <button type='submit' disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Place Limit Order'}
                </button>
            </form>

            {successMsg && (
                <Notification
                    variant='success'
                    message={successMsg}
                    onClose = {() => setSuccessMsg('')}
                />
            )}

            {errorMsg && (
                <Notification
                    variant='error'
                    message={errorMsg}
                    onClose = {() => setErrorMsg('')}
                />
            )}
        </div>
    )
}

export default OrderForm;