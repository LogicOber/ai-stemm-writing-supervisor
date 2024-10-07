import React, { memo } from 'react';

const TextInput = memo(({ value, onChange, placeholder, rows }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;