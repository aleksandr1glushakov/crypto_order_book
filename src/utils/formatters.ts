export function formatPrice(value: number): string {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatQuantity(value: number): string {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
    })
}