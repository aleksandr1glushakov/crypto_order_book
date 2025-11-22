import React, { useState } from 'react';

interface FormInputProps {
    label: string;
    name: string;
    type?: 'text' | 'number';
    value: string;
    onChange: (name: string, value: string, isValid: boolean) => void;
    requiredPositive?: boolean;
    step?: string;
    min?: string;
}

const FormInput: React.FC<FormInputProps> = ({
        label,
        name,
        type = 'text',
        value,
        onChange,
        requiredPositive = false,
        step,
        min,
     }) => {
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        let isValid = true;
        let errorMsg = '';

        if (requiredPositive && val !== '') {
            const num = Number(val);
            if (!num || num <= 0) {
                isValid = false;
                errorMsg = `${name} must be > 0`;
            }
        }

        setError(errorMsg);
        onChange(name, val, isValid);
    };

    const baseStyle: React.CSSProperties = {
        border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: 4,
        padding: '4px 6px',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: 14 }}>
                {label}&nbsp;
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    style={baseStyle}
                    step={step}
                    min={min}
                    inputMode={type === 'number' ? 'decimal' : undefined}
                />
            </label>
            {error && (
                <div style={{ color: '#ef4444', fontSize: 12 }}>{error}</div>
            )}
        </div>
    );
};

export default FormInput;