import { useEffect, useState } from 'react';
import { Asset } from '../types/trade';
import { OrderbookViewModel } from '../types/orderbook';
import { fetchOrderbook } from '../api/api';

const REFRESH_INTERVAL_MS = 5000;

export function useOrderbook(asset: Asset) {
    const [orderbook, setOrderbook] = useState<OrderbookViewModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setLoading(true);
            setErrorMsg('');
            try {
                const data = await fetchOrderbook(asset);
                if (isMounted) {
                    setOrderbook(data);
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMsg(
                        error instanceof Error ? error.message : 'Failed to load orderbook'
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        load();
        const interval = setInterval(load, REFRESH_INTERVAL_MS);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [asset]);

    return { orderbook, loading, errorMsg, setErrorMsg };
}