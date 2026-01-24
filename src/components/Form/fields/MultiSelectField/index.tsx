import React from 'react';
import { Select } from '@douyinfe/semi-ui';
import { IMultiSelectField, IOptionItem } from '../../../../types';

interface MultiSelectFieldProps {
  field: IMultiSelectField;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function MultiSelectField({ field, value, onChange, error, disabled }: MultiSelectFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  const optionList = field.options.map((option: IOptionItem) => ({
    value: option.value || option.label,
    label: option.label,
    disabled: false,
  }));

  return (
    <div className="multi-select-field field-top" style={{ textAlign: field.align || 'left' }}>
      <label 
        className="multi-select-field-label field-top-label"
        style={{ 
          marginBottom: `${labelSpacing}px`,
          fontSize: `${field.labelFontSize || 14}px`
        }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
        <Select
          placeholder={field.placeholder || '请选择'}
          value={value || []}
          onChange={(val) => onChange(val as string[])}
          disabled={disabled || false}
          optionList={optionList}
          filter
          multiple
          showClear
          maxTagCount={field.maxSelect}

          style={{ width: field.width === 'full' ? '100%' : 'auto' }}
          aria-label={`${field.name} ${field.placeholder || '请选择'}`}
          aria-required={field.required === true}
          aria-invalid={!!error}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
