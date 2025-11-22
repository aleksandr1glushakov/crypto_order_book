import React from "react";

type Variant = 'success' | 'error' | 'info';

interface NotificationProps {
    variant: Variant;
    message: string;
    onClose?: () => void;
}

const bg: Record<Variant, string> = {
    success: '#d1fae5',
    error: '#fee2e2',
    info: '#e0f2fe',
}

const border: Record<Variant, string> = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
}

const Notification: React.FC<NotificationProps> = ({ variant, message, onClose }) => {
    if(!message) {
        return null;
    }

    return (
        <div
            style={{
                border: `1px solid ${border[variant]}`,
                backgroundColor: bg[variant],
                padding: '0.75rem 1rem',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.75rem',
                fontSize: 14,
            }}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: '1rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: 18,
                        lineHeight: 1,
                    }}
                >
                    x
                </button>
            )}
        </div>
    )
}

export default Notification;