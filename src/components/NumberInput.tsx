import { useState, useEffect } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function NumberInput({ value, onChange, className }: Props) {
  const [display, setDisplay] = useState(value === 0 ? '' : String(value));

  useEffect(() => {
    setDisplay(value === 0 ? '' : String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        setDisplay(raw);
        onChange(raw === '' ? 0 : Number(raw));
      }}
      onBlur={() => setDisplay(value === 0 ? '' : String(value))}
      className={className}
      style={{ fontSize: '16px' }}
    />
  );
}
