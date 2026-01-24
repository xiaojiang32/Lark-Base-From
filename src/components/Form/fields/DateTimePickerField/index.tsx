import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import { IDateTimePickerField } from '../../../../types';

interface DateTimePickerFieldProps {
  field: IDateTimePickerField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function DateTimePickerField({ field, value, onChange, error, disabled }: DateTimePickerFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  const formatDateTime = (date: Date | null | undefined): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    let dateStr: string;
    switch (field.dateFormat) {
      case 'MM/DD/YYYY':
        dateStr = `${month}/${day}/${year}`;
        break;
      case 'DD/MM/YYYY':
        dateStr = `${day}/${month}/${year}`;
        break;
      case 'YYYY-MM-DD':
      default:
        dateStr = `${year}-${month}-${day}`;
        break;
    }
    
    let timeStr: string;
    switch (field.timeFormat) {
      case 'HH:mm:ss':
        timeStr = `${hours}:${minutes}:${seconds}`;
        break;
      case 'HH:mm':
      default:
        timeStr = `${hours}:${minutes}`;
        break;
    }
    
    return `${dateStr} ${timeStr}`;
  };

  const parseDateTime = (dateTimeStr: string): Date | null => {
    if (!dateTimeStr) return null;
    
    const [datePart, timePart] = dateTimeStr.split(' ');
    let year: number, month: number, day: number;
    let hours: number = 0, minutes: number = 0, seconds: number = 0;
    
    switch (field.dateFormat) {
      case 'MM/DD/YYYY':
        [month, day, year] = datePart.split('/').map(Number);
        break;
      case 'DD/MM/YYYY':
        [day, month, year] = datePart.split('/').map(Number);
        break;
      case 'YYYY-MM-DD':
      default:
        [year, month, day] = datePart.split('-').map(Number);
        break;
    }
    
    if (timePart) {
      [hours, minutes, seconds] = timePart.split(':').map(Number);
    }
    
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };

  const handleDateTimeChange = (date: Date | null | undefined) => {
    onChange(formatDateTime(date));
  };

  return (
    <div className="date-time-picker-field field-top" style={{ textAlign: field.align || 'left' }}>
      <label 
        className="date-time-picker-field-label field-top-label"
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
          type="dateTime"
          placeholder={field.placeholder || '请选择日期时间'}
          value={parseDateTime(value) || undefined}
          onChange={(date) => handleDateTimeChange(date as Date | null | undefined)}
          disabled={disabled || false}
          disabledDate={(date) => {
            if (!date) return false;
            const minDateTime = field.minDateTime ? parseDateTime(field.minDateTime) : null;
            const maxDateTime = field.maxDateTime ? parseDateTime(field.maxDateTime) : null;
            
            if (minDateTime && date < minDateTime) return true;
            if (maxDateTime && date > maxDateTime) return true;
            
            return false;
          }}

          style={{ width: field.width === 'full' ? '100%' : 'auto' }}
          aria-label={`${field.name} ${field.placeholder || '请选择日期时间'}`}
          aria-required={field.required === true}
          aria-invalid={!!error}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
