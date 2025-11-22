import {Asset, OrderType, Side, TradeRequest, TradeResponse} from "../types/trade";
import React, { useEffect, useState} from "react";
import Notification from "./Notification";
import {round, toStringSafe} from "../utils/round";
import FormInput from "./FormInput";


interface OrderFormProps {
    asset: Asset;
    onSubmitOrder: (order: TradeRequest) => Promise<TradeResponse>;
    initialSide?: Side;
    initialPrice?: number | null;
    autoSubmitTrigger?: number;
}

type FormState = {
    side: Side;
    price: string;
    quantity: string;
    notional: string;
};

type FormValidity = {
    price: boolean;
    quantity: boolean;
    notional: boolean;
};

type LastEdited = 'quantity' | 'notional' | null;


const OrderForm: React.FC<OrderFormProps> = ({
    asset,
    onSubmitOrder,
    initialSide,
    initialPrice,
    autoSubmitTrigger,
}) => {
    const [form, setForm] = useState<FormState>({
        side: Side.BUY,
        price: '',
        quantity: '',
        notional: '',
    });

    const [validity, setValidity] = useState<FormValidity>({
        price: true,
        quantity: true,
        notional: true,
    });

    const [lastEdited, setLastEdited] = useState<LastEdited>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [lastAutoSubmitTrigger, setLastAutoSubmitTrigger] = useState(0);

    useEffect(() => {
        if (initialSide == null && initialPrice == null) return;

        setForm((prev) =>({
            ...prev,
            side: initialSide ?? prev.side,
            price: initialPrice != null ? String(initialPrice) : prev.price,
        }))
    }, [initialPrice, initialSide]);

    useEffect(()=>{
        const priceNum = Number(form.price) || 0;
        if(priceNum <= 0) return;

        if(lastEdited === 'quantity'){
            const qty = Number(form.quantity) || 0;
            if(qty > 0) {
                const notional = qty * priceNum;
                setForm((prev) => ({...prev, notional: toStringSafe(notional, 6)}))
            }
        } else if (lastEdited === 'notional') {
            const notionalNum = Number(form.notional) || 0;
            if(notionalNum > 0){
                const qty = notionalNum / priceNum;
                setForm((prev) =>({...prev, quantity: toStringSafe(qty, 6)}))
            }
        }

    }, [form.price, form.quantity, form.notional, lastEdited])

    const handleFieldChange = (
        name: string,
        value: string,
        isValid: boolean
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'price' || name === 'quantity' || name === 'notional') {
            setValidity((prev) => ({
                ...prev,
                [name]: isValid,
            }));
        }

        if (name === 'quantity') setLastEdited('quantity');
        if (name === 'notional') setLastEdited('notional');
    };


    const handleSideChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const value = e.target.value as Side;
        setForm((prev) => ({...prev, side: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        if (e){
            e.preventDefault();
        }
        setSuccessMsg('');
        setErrorMsg('');

        if (!validity.price || !validity.quantity || !validity.notional) {
            setErrorMsg('Please fix the highlighted fields.');
            return;
        }

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
            price: round(priceNum, 6),
            quantity: round(qtyNum, 6),
            notional: round(notionalNum, 6),
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


    useEffect(() => {
        if (!autoSubmitTrigger) return;
        if(autoSubmitTrigger === lastAutoSubmitTrigger) return;
        if (initialPrice == null) return;

        const qtyNum = Number(form.quantity);
        const priceNum = initialPrice;

            if (!qtyNum || qtyNum <= 0 || !priceNum || priceNum <= 0) {
                setLastAutoSubmitTrigger(autoSubmitTrigger);
                return;
            }

            const notionalNum = qtyNum * priceNum;
            const sideToUse = initialSide ?? form.side;

                setForm((prev) => ({
                    ...prev,
                        side: sideToUse,
                        price: toStringSafe(priceNum, 6),
                        quantity: toStringSafe(qtyNum, 6),
                        notional: toStringSafe(notionalNum, 6),
            }));

            const payload: TradeRequest = {
                asset,
                    side: sideToUse,
                    type: OrderType.LIMIT,
                    price: round(priceNum, 6),
                    quantity: round(qtyNum, 6),
                    notional: round(notionalNum, 6),
            };

            (async () => {
                setSubmitting(true);
                setSuccessMsg('');
                setErrorMsg('');
                try {
                    const response = await onSubmitOrder(payload);
                    setSuccessMsg(
                        `Order placed from orderbook (id=${response.id}, side=${response.side}, qty=${response.quantity}).`
                        );
                    } catch (err) {
                        setErrorMsg(
                        err instanceof Error
                        ? err.message : 'Unknown error placing order from orderbook.');
                    } finally {
                        setSubmitting(false);
                        setLastAutoSubmitTrigger(autoSubmitTrigger);
                    }
                })();
        }, [
        autoSubmitTrigger,
        lastAutoSubmitTrigger,
        initialPrice,
        initialSide,
        asset,
        onSubmitOrder,
        form.quantity,
        form.side,
        ]);

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
                        <select name='side-select' id='side-select' value={form.side} onChange={handleSideChange}>
                            <option value={Side.BUY}>{Side.BUY}</option>
                            <option value={Side.SELL}>{Side.SELL}</option>
                        </select>
                    </label>
                </div>

                <FormInput
                    label="Price:"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFieldChange}
                    requiredPositive
                    step="0.000001"
                    min="0.000001"
                />

                <FormInput
                    label="Quantity:"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleFieldChange}
                    requiredPositive
                    step="0.000001"
                    min="0.000001"
                />

                <FormInput
                    label="Notional (price × quantity):"
                    name="notional"
                    type="number"
                    value={form.notional}
                    onChange={handleFieldChange}
                    requiredPositive
                    step="0.000001"
                    min="0.000001"
                />

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

export default React.memo(OrderForm);