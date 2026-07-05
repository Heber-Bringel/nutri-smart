import { useState, useEffect, useRef } from 'react';

interface PatientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [localValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Buscar paciente por nome..."
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
    />
  );
}
