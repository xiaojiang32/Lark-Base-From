import React from 'react';
import { Input } from '@douyinfe/semi-ui';
import { ITextField } from '../../../../types';

interface TextFieldProps {
  field: ITextField;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export default function TextField({ field, value, onChange, onBlur, error, disabled }: TextFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  
  return (
    <div className="text-field field-top">
      <label 
        className="text-field-label field-top-label"
        style={{ marginBottom: `${labelSpacing}px` }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      <Input
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || false}
        maxLength={field.maxLength}
        error={!!error}
        aria-label={`${field.name} ${field.placeholder || '请输入'}`}
        aria-required={field.required === true}
        aria-invalid={!!error}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
