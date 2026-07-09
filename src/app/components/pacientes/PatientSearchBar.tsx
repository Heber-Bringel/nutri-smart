import { useState, useRef, useEffect } from 'react';

interface PatientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeRef.current(newValue);
    }, 300);
  }

  if (value !== localValue) {
    setLocalValue(value);
  }

  return (
    <input
      type="text"
      placeholder="Buscar paciente por nome..."
      value={localValue}
      onChange={handleChange}
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
