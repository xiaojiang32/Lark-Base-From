import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import { IDatePickerField } from '../../../../types';

interface DatePickerFieldProps {
  field: IDatePickerField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function DatePickerField({ field, value, onChange, error, disabled }: DatePickerFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    switch (field.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    let year: number, month: number, day: number;
    
    switch (field.dateFormat) {
      case 'MM/DD/YYYY':
        [month, day, year] = dateStr.split('/').map(Number);
        break;
      case 'DD/MM/YYYY':
        [day, month, year] = dateStr.split('/').map(Number);
        break;
      case 'YYYY-MM-DD':
      default:
        [year, month, day] = dateStr.split('-').map(Number);
        break;
    }
    
    return new Date(year, month - 1, day);
  };

  const handleDateChange = (date: Date | null | undefined) => {
    onChange(formatDate(date));
  };

  return (
    <div className="date-picker-field field-top" style={{ textAlign: field.align || 'left' }}>
      <label 
        className="date-picker-field-label field-top-label"
        style={{ 
          marginBottom: `${labelSpacing}px`,
          fontSize: `${field.labelFontSize || 14}px`
        }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      <div style={{ display: 'flex', justifyContent: (field.align || 'left') === 'left' ? 'flex-start' : (field.align || 'left') === 'center' ? 'center' : 'flex-end' }}>
        <DatePicker
          placeholder={field.placeholder || '请选择日期'}
          value={parseDate(value) || undefined}
          onChange={(date) => handleDateChange(date as Date | null | undefined)}
          disabled={disabled || false}
          disabledDate={(date) => {
            if (!date) return false;
            const minDate = field.minDate ? parseDate(field.minDate) : null;
            const maxDate = field.maxDate ? parseDate(field.maxDate) : null;
            
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            
            return false;
          }}

          style={{ width: field.width === 'full' ? '100%' : 'auto' }}
          aria-label={`${field.name} ${field.placeholder || '请选择日期'}`}
          aria-required={field.required === true}
          aria-invalid={!!error}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
