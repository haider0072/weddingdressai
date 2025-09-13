
import React, { useState, useEffect } from 'react';

interface ColorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ColorInput: React.FC<ColorInputProps> = ({ id, label, value, onChange, disabled }) => {
  const [colorPreview, setColorPreview] = useState<string>('transparent');

  useEffect(() => {
    // Basic validation for hex codes and color names
    const s = new Option().style;
    s.color = value;
    if (s.color !== '') {
      setColorPreview(value);
    } else {
      setColorPreview('transparent');
    }
  }, [value]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-gray-300 transition-colors"
          style={{ backgroundColor: colorPreview }}
        />
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., Baby Pink or #FFC0CB"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition"
        />
      </div>
    </div>
  );
};

export default ColorInput;
