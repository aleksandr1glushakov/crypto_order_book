export const round = (value: number, decimals: number) => {
    if (!Number.isFinite(value)) return value;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

export const toStringSafe = (value: number, decimals: number) => {
    const rounded = round(value, decimals);
    return rounded.toFixed(decimals).replace(/\.?0+$/, '');
};