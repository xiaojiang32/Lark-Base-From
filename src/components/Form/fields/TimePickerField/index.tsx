import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';
import { ITimePickerField } from '../../../../types';

interface TimePickerFieldProps {
  field: ITimePickerField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function TimePickerField({ field, value, onChange, error, disabled }: TimePickerFieldProps) {
  const labelSpacing = field.labelSpacing || 8;
  const formatTime = (date: Date | null | undefined): string => {
    if (!date) return '';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    switch (field.timeFormat) {
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'HH:mm':
      default:
        return `${hours}:${minutes}`;
    }
  };

  const parseTime = (timeStr: string): Date | null => {
    if (!timeStr) return null;
    
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    
    return date;
  };

  const handleTimeChange = (date: Date | null | undefined) => {
    onChange(formatTime(date));
  };

  const generateTimeSteps = () => {
    const steps: number[] = [];
    const interval = field.timeInterval || 30;
    
    for (let i = 0; i < 60; i += interval) {
      steps.push(i);
    }
    
    return steps;
  };

  return (
    <div className="time-picker-field field-top">
      <label 
        className="time-picker-field-label field-top-label"
        style={{ marginBottom: `${labelSpacing}px` }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      <TimePicker
        placeholder={field.placeholder || '请选择时间'}
        value={parseTime(value) || undefined}
        onChange={(date) => handleTimeChange(date as Date | null | undefined)}
        disabled={disabled || false}
        format={field.timeFormat || 'HH:mm'}
        minuteStep={field.timeInterval || 30}
        error={!!error}
        style={{ width: '100%' }}
        aria-label={`${field.name} ${field.placeholder || '请选择时间'}`}
        aria-required={field.required === true}
        aria-invalid={!!error}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
