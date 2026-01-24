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
  
  // 根据align和width属性设置input的宽度
  const getInputWidth = () => {
    // 如果明确设置了full宽度，不管对齐方式如何，都占据整个宽度
    if (field.width === 'full') {
      return '100%';
    }
    // 如果设置了auto宽度或者没有设置宽度，返回auto
    if (field.width === 'auto' || !field.width) {
      return 'auto';
    }
    // 默认情况下，input宽度100%
    return '100%';
  };
  
  return (
    <div className="text-field field-top" style={{ textAlign: field.align || 'left' }}>
      <label 
        className="text-field-label field-top-label"
        style={{ 
          marginBottom: `${labelSpacing}px`,
          fontSize: `${field.labelFontSize || 14}px`
        }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
        <Input
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled || false}
          maxLength={field.maxLength}
          style={{ width: getInputWidth() }}

          aria-label={`${field.name} ${field.placeholder || '请输入'}`}
          aria-required={field.required === true}
          aria-invalid={!!error}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
