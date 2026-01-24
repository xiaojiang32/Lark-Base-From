import React from 'react';
import { Radio, Checkbox, Select, Tag } from '@douyinfe/semi-ui';
import { IOptionField, IOptionItem } from '../../../../types';

interface OptionFieldProps {
  field: IOptionField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export default function OptionField({ field, value, onChange, error, disabled }: OptionFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  const renderRadio = () => (
    <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || false}
        direction={field.direction || 'horizontal'}
      >
        {field.options.map((option: IOptionItem) => (
          <Radio key={option.id} value={option.value || option.label}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );

  const renderCheckbox = () => (
    <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
      <Checkbox.Group
        value={value || []}
        onChange={onChange}
        disabled={disabled || false}
        direction={field.direction || 'horizontal'}
      >
        {field.options.map((option: IOptionItem) => (
          <Checkbox key={option.id} value={option.value || option.label}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );

  const renderSelect = () => (
    <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
      <Select
          value={value}
          onChange={onChange}
          disabled={disabled || false}
          optionList={field.options.map((option: IOptionItem) => ({
            value: option.value || option.label,
            label: option.label,
          }))}
          style={{ width: field.width === 'full' ? '100%' : 'auto' }}
        />
    </div>
  );

  const renderTag = () => (
    <div className="tag-group" style={{ 
      display: 'flex', 
      justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end', 
      flexDirection: (field.direction || 'horizontal') === 'horizontal' ? 'row' : 'column',
      flexWrap: field.direction === 'vertical' ? 'nowrap' : 'wrap',
      alignContent: 'flex-start',
      gap: '8px'
    }}>
      {field.options.map((option: IOptionItem) => {
        const isSelected = value === (option.value || option.label);
        return (
          <Tag
            key={option.id}
            color={isSelected ? 'blue' : 'grey'}
            onClick={() => !disabled && onChange(option.value || option.label)}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            {option.label}
          </Tag>
        );
      })}
    </div>
  );

  const renderField = () => {
    switch (field.optionType) {
      case 'radio':
        return renderRadio();
      case 'checkbox':
        return renderCheckbox();
      case 'select':
        return renderSelect();
      default:
        return renderRadio();
    }
  };

  return (
    <div className="option-field field-top" style={{ textAlign: field.align || 'left' }}>
      <label 
        className="option-field-label field-top-label"
        style={{ 
          marginBottom: `${labelSpacing}px`,
          fontSize: `${field.labelFontSize || 14}px`
        }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      {renderField()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
