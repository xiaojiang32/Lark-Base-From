import React from 'react';
import { ICompositeField, IFormField } from '../../../../types';
import TextField from '../TextField';
import OptionField from '../OptionField';
import SelectField from '../SelectField';
import MultiSelectField from '../MultiSelectField';
import DatePickerField from '../DatePickerField';
import TimePickerField from '../TimePickerField';
import DateTimePickerField from '../DateTimePickerField';

interface CompositeFieldProps {
  field: ICompositeField;
  allFields: IFormField[];
  formData: Record<string, any>;
  handleFieldChange: (fieldId: string, value: any) => void;
  handleFieldBlur: (fieldId: string) => void;
  errors: Record<string, string>;
  isFormDisabled: boolean;
  isFieldVisible: (field: IFormField) => boolean;
}

export default function CompositeField({ field, allFields, formData, handleFieldChange, handleFieldBlur, errors, isFormDisabled, isFieldVisible }: CompositeFieldProps) {
  // 解析宽度比例，如 "1:1:1" -> ["1", "1", "1"] -> "1fr 1fr 1fr"
  const parseWidthRatios = () => {
    if (!field.widthRatios) return '1fr 1fr';
    
    const ratios = field.widthRatios.split(':').map(ratio => ratio.trim());
    // 确保比例数量与子组件数量匹配
    if (ratios.length !== field.children.length) {
      return field.children.map(() => '1fr').join(' ');
    }
    
    return ratios.map(ratio => {
      if (ratio === 'auto') return 'auto';
      return `${ratio}fr`;
    }).join(' ');
  };

  // 获取子组件对象
  const getChildFields = () => {
    return field.children
      .map(childId => allFields.find(f => f.id === childId))
      .filter((child): child is IFormField => child !== undefined && isFieldVisible(child));
  };

  // 渲染单个子组件
  const renderChildField = (childField: IFormField) => {
    const value = formData[childField.id] || '';
    const error = errors[childField.id];

    switch (childField.type) {
      case 'text':
        return (
          <TextField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            onBlur={() => handleFieldBlur(childField.id)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'option':
        return (
          <OptionField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'select':
        return (
          <SelectField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'multiSelect':
        return (
          <MultiSelectField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'datePicker':
        return (
          <DatePickerField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'timePicker':
        return (
          <TimePickerField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      case 'dateTimePicker':
        return (
          <DateTimePickerField
            field={childField as any}
            value={value}
            onChange={(val) => handleFieldChange(childField.id, val)}
            error={error}
            disabled={isFormDisabled}
          />
        );
      default:
        return null;
    }
  };

  const childFields = getChildFields();
  const gridTemplateColumns = parseWidthRatios();

  return (
    <div className="composite-field field-top" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 显示字段名称 */}
      <label 
        className="composite-field-label field-top-label"
        style={{ 
          fontSize: `${field.labelFontSize || 14}px`
        }}
      >
        {field.name}
        {field.required && <span className="required-mark">*</span>}
      </label>
      
      {/* 专用间距div，确保标签间距生效 */}
      <div style={{ height: `${field.labelSpacing ?? 8}px` }}></div>
      
      {childFields.length > 0 ? (
        <div 
          className="composite-field-container" 
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplateColumns,
            gap: '12px',
            width: '100%'
          }}
        >
          {childFields.map(childField => (
            <div key={childField.id} data-field-id={childField.id}>
              {renderChildField(childField)}
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="composite-field-empty" 
          style={{
            width: '100%',
            height: '60px',
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}
        >
          {field.name || '组合组件'}
        </div>
      )}
    </div>
  );
}