import React from 'react';
import { Input, Select, Switch, Button, Card, Collapse, InputNumber, DatePicker, TimePicker } from '@douyinfe/semi-ui';
import { IFormField, ITextField, IOptionField, ISelectField, IMultiSelectField, IDatePickerField, ITimePickerField, IDateTimePickerField, IOptionItem, FieldType, FormAlign, FormFieldWidth } from '../../../../types';
import { generateId } from '../../../../utils';

const parseDate = (dateStr: string, format: string = 'YYYY-MM-DD'): Date | null => {
  if (!dateStr) return null;
  
  let year: number, month: number, day: number;
  
  switch (format) {
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

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const parseTime = (timeStr: string): Date | null => {
  if (!timeStr) return null;
  
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  
  return date;
};

const formatTime = (date: Date | null | undefined): string => {
  if (!date) return '';
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

const parseDateTime = (dateTimeStr: string, dateFormat: string = 'YYYY-MM-DD'): Date | null => {
  if (!dateTimeStr) return null;
  
  const [datePart, timePart] = dateTimeStr.split(' ');
  let year: number, month: number, day: number;
  let hours: number = 0, minutes: number = 0;
  
  switch (dateFormat) {
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
    const [h, m] = timePart.split(':').map(Number);
    hours = h;
    minutes = m;
  }
  
  return new Date(year, month - 1, day, hours, minutes);
};

const formatDateTime = (date: Date | null | undefined): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

interface FieldConfigPanelProps {
  field: IFormField | null;
  onUpdateField: (field: IFormField) => void;
  onDeleteField: (fieldId: string) => void;
  allFields?: IFormField[];
}

export default function FieldConfigPanel({ field, onUpdateField, onDeleteField, allFields = [] }: FieldConfigPanelProps) {
  const [originalId, setOriginalId] = React.useState<string>(field?.id || '');
  const [idError, setIdError] = React.useState<string>('');
  const [tempId, setTempId] = React.useState<string>(field?.id || '');

  React.useEffect(() => {
    setOriginalId(field?.id || '');
    setTempId(field?.id || '');
  }, [field?.id]);

  if (!field) {
    return (
      <div className="field-config-panel">
        <Card className="empty-state">
          <div className="empty-message">请选择一个字段进行配置</div>
        </Card>
      </div>
    );
  }

  const updateField = (updates: any) => {
    const updatedField = { ...field, ...updates };
    onUpdateField(updatedField);
  };

  const handleIdBlur = (newId: string) => {
    // 检查ID唯一性
    const isDuplicate = allFields.some(f => f.id === newId && f.id !== originalId);
    if (isDuplicate) {
      setIdError('组件ID已存在，请使用其他ID');
      // 恢复到原始ID（只更新本地状态，不触发父组件更新）
      setTempId(originalId);
      return;
    }
    // 清除错误提示
    setIdError('');
    // 如果ID改变了，使用原始ID来匹配
    if (newId !== originalId) {
      onUpdateField({ ...field, id: newId });
    }
  };

  const handleIdChange = (newId: string) => {
    // 只更新本地状态，不触发父组件更新
    setTempId(newId);
    // 清除错误提示
    if (idError) {
      setIdError('');
    }
  };

  const addOption = () => {
    if (field.type === 'option' || field.type === 'select' || field.type === 'multiSelect') {
      const optionField = field as any;
      const newOption: IOptionItem = {
        id: generateId(),
        label: `选项${optionField.options.length + 1}`,
        order: optionField.options.length,
      };
      updateField({ options: [...optionField.options, newOption] });
    }
  };

  const updateOption = (optionId: string, updates: Partial<IOptionItem>) => {
    if (field.type === 'option' || field.type === 'select' || field.type === 'multiSelect') {
      const optionField = field as any;
      const newOptions = optionField.options.map((opt: IOptionItem) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      );
      updateField({ options: newOptions });
    }
  };

  const deleteOption = (optionId: string) => {
    if (field.type === 'option' || field.type === 'select' || field.type === 'multiSelect') {
      const optionField = field as any;
      const newOptions = optionField.options.filter((opt: IOptionItem) => opt.id !== optionId);
      updateField({ options: newOptions });
    }
  };

  const renderCommonConfig = () => (
    <>
      {/* 组件ID配置，组合组件不需要 */}
      {field.type !== 'composite' && (
        <div className="config-item">
          <label>组件ID</label>
          <Input
            value={tempId}
            onChange={(value) => handleIdChange(value)}
            onBlur={(e) => handleIdBlur((e.target as HTMLInputElement).value)}
            placeholder="组件ID"
          />
          {idError && <div className="error-message">{idError}</div>}
        </div>
      )}
      {/* 字段名称配置，组合组件需要 */}
      <div className="config-item">
        <label>字段名称</label>
        <Input
          value={field.name}
          onChange={(value) => updateField({ name: value })}
          placeholder="请输入字段名称"
          maxLength={30}
        />
      </div>
      <div className="config-item">
        <label>字段名称字体大小</label>
        <InputNumber
          value={field.labelFontSize || 14}
          onChange={(value) => updateField({ labelFontSize: value })}
          min={8}
          max={32}
          step={1}
        />
      </div>
      {/* 对齐方式配置，组合组件不需要 */}
      {field.type !== 'composite' && (
        <>
          <div className="config-item">
            <label>对齐方式</label>
            <Select
              value={field.align || 'left'}
              onChange={(value) => updateField({ align: value as FormAlign })}
              optionList={[
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'right', label: '右对齐' }
              ]}
            />
          </div>
          <div className="config-item">
            <label>宽度</label>
            <Select
              value={field.width || 'auto'}
              onChange={(value) => updateField({ width: value as FormFieldWidth })}
              optionList={[
                { value: 'auto', label: '自适应' },
                { value: 'full', label: '占满' }
              ]}
            />
          </div>
          <div className="config-item">
            <label>是否必填</label>
            <Switch
              checked={field.required}
              onChange={(checked) => updateField({ required: checked })}
            />
          </div>
        </>
      )}
      <div className="config-item">
        <label>标签间距</label>
        <InputNumber
          value={field.labelSpacing ?? 8}
          onChange={(value) => updateField({ labelSpacing: value })}
          min={0}
          max={32}
        />
      </div>
    </>
  );

  const renderTextFieldConfig = () => {
    const textField = field as ITextField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={textField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认文本</label>
          <Input
            value={textField.defaultValue || ''}
            onChange={(value) => updateField({ defaultValue: value })}
            placeholder="请输入默认文本"
          />
        </div>
        <div className="config-item">
          <label>最大文本长度</label>
          <InputNumber
            value={textField.maxLength || 200}
            onChange={(value) => updateField({ maxLength: value })}
            min={0}
            max={500}
          />
        </div>
        <div className="config-item">
          <label>校验规则</label>
          <Select
            value={textField.inputType || 'none'}
            onChange={(value) => updateField({ inputType: value })}
            optionList={[
              { value: 'none', label: '无限制' },
              { value: 'number', label: '仅数字' },
              { value: 'letter', label: '仅字母' },
              { value: 'alphanumeric', label: '仅字母和数字' },
              { value: 'email', label: '邮箱格式' },
              { value: 'phone', label: '手机号格式' },
              { value: 'url', label: 'URL格式' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={textField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
      </>
    );
  };

  const renderOptionFieldConfig = () => {
    const optionField = field as IOptionField;
    return (
      <>
        <div className="config-item">
          <label>选项类型</label>
          <Select
            value={optionField.optionType}
            onChange={(value) => updateField({ optionType: value })}
            optionList={[
              { value: 'radio', label: '单选（Radio）' },
              { value: 'checkbox', label: '多选（Checkbox）' },
              { value: 'tag', label: '标签选择（Tag）' },
            ]}
          />
        </div>
        {optionField.optionType === 'checkbox' && (
          <>
            <div className="config-item">
              <label>最少选择数</label>
              <InputNumber
                value={optionField.minSelect || 0}
                onChange={(value) => updateField({ minSelect: value })}
                min={0}
              />
            </div>
            <div className="config-item">
              <label>最多选择数</label>
              <InputNumber
                value={optionField.maxSelect || 0}
                onChange={(value) => updateField({ maxSelect: value })}
                min={0}
              />
            </div>
          </>
        )}
        <div className="config-item">
          <label>默认值</label>
          {optionField.optionType === 'checkbox' ? (
            <Select
              value={optionField.defaultValue || []}
              onChange={(value) => updateField({ defaultValue: value })}
              placeholder="请选择默认值"
              optionList={optionField.options.map((option) => ({
                value: option.value || option.label,
                label: option.label,
              }))}
              multiple
            />
          ) : (
            <Select
              value={optionField.defaultValue || ''}
              onChange={(value) => updateField({ defaultValue: value })}
              placeholder="请选择默认值"
              optionList={optionField.options.map((option) => ({
                value: option.value || option.label,
                label: option.label,
              }))}
            />
          )}
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={optionField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
        <div className="config-item">
          <div className="options-header">
            <label>选项列表</label>
            <Button size="small" onClick={addOption}>添加选项</Button>
          </div>
          <div className="options-list">
            {optionField.options.map((option: IOptionItem, index: number) => (
              <div key={option.id} className="option-item">
                <Input
                  value={option.label}
                  onChange={(value) => updateOption(option.id, { label: value })}
                  placeholder={`选项${index + 1}`}
                />
                <Button
                  type="danger"
                  size="small"
                  onClick={() => deleteOption(option.id)}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSelectFieldConfig = () => {
    const selectField = field as ISelectField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={selectField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认值</label>
          <Select
            value={selectField.defaultValue || ''}
            onChange={(value) => updateField({ defaultValue: value })}
            placeholder="请选择默认值"
            optionList={selectField.options.map((option) => ({
              value: option.value || option.label,
              label: option.label,
            }))}
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={selectField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
        <div className="config-item">
          <div className="options-header">
            <label>选项列表</label>
            <Button size="small" onClick={addOption}>添加选项</Button>
          </div>
          <div className="options-list">
            {selectField.options.map((option: IOptionItem, index: number) => (
              <div key={option.id} className="option-item">
                <Input
                  value={option.label}
                  onChange={(value) => updateOption(option.id, { label: value })}
                  placeholder={`选项${index + 1}`}
                />
                <Button
                  type="danger"
                  size="small"
                  onClick={() => deleteOption(option.id)}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderMultiSelectFieldConfig = () => {
    const multiSelectField = field as IMultiSelectField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={multiSelectField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认值</label>
          <Select
            value={multiSelectField.defaultValue || []}
            onChange={(value) => updateField({ defaultValue: value })}
            placeholder="请选择默认值"
            optionList={multiSelectField.options.map((option) => ({
              value: option.value || option.label,
              label: option.label,
            }))}
            multiple
          />
        </div>
        <div className="config-item">
          <label>最少选择数</label>
          <InputNumber
            value={multiSelectField.minSelect || 0}
            onChange={(value) => updateField({ minSelect: value })}
            min={0}
          />
        </div>
        <div className="config-item">
          <label>最多选择数</label>
          <InputNumber
            value={multiSelectField.maxSelect || 0}
            onChange={(value) => updateField({ maxSelect: value })}
            min={0}
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={multiSelectField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
        <div className="config-item">
          <div className="options-header">
            <label>选项列表</label>
            <Button size="small" onClick={addOption}>添加选项</Button>
          </div>
          <div className="options-list">
            {multiSelectField.options.map((option: IOptionItem, index: number) => (
              <div key={option.id} className="option-item">
                <Input
                  value={option.label}
                  onChange={(value) => updateOption(option.id, { label: value })}
                  placeholder={`选项${index + 1}`}
                />
                <Button
                  type="danger"
                  size="small"
                  onClick={() => deleteOption(option.id)}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderDatePickerFieldConfig = () => {
    const datePickerField = field as IDatePickerField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={datePickerField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认值</label>
          <DatePicker
            value={datePickerField.defaultValue ? parseDate(datePickerField.defaultValue, datePickerField.dateFormat) || undefined : undefined}
            onChange={(date) => {
              let d: Date | null | undefined;
              if (Array.isArray(date)) {
                d = date[0] instanceof Date ? date[0] : parseDate(date[0]);
              } else if (typeof date === 'string') {
                d = parseDate(date);
              } else {
                d = date;
              }
              updateField({ defaultValue: formatDate(d) });
            }}
            placeholder={datePickerField.dateFormat || 'YYYY-MM-DD'}
            style={{ width: '100%' }}
          />
        </div>
        <div className="config-item">
          <label>日期格式</label>
          <Select
            value={datePickerField.dateFormat || 'YYYY-MM-DD'}
            onChange={(value) => updateField({ dateFormat: value })}
            optionList={[
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>最小日期</label>
          <Input
            value={datePickerField.minDate || ''}
            onChange={(value) => updateField({ minDate: value })}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="config-item">
          <label>最大日期</label>
          <Input
            value={datePickerField.maxDate || ''}
            onChange={(value) => updateField({ maxDate: value })}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={datePickerField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
      </>
    );
  };

  const renderTimePickerFieldConfig = () => {
    const timePickerField = field as ITimePickerField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={timePickerField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认值</label>
          <TimePicker
            value={timePickerField.defaultValue ? parseTime(timePickerField.defaultValue) || undefined : undefined}
            onChange={(date) => {
              let d: Date | null | undefined;
              if (Array.isArray(date)) {
                d = date[0] instanceof Date ? date[0] : parseTime(date[0]);
              } else if (typeof date === 'string') {
                d = parseTime(date);
              } else {
                d = date;
              }
              updateField({ defaultValue: formatTime(d) });
            }}
            placeholder={timePickerField.timeFormat || 'HH:mm'}
            style={{ width: '100%' }}
          />
        </div>
        <div className="config-item">
          <label>时间格式</label>
          <Select
            value={timePickerField.timeFormat || 'HH:mm'}
            onChange={(value) => updateField({ timeFormat: value })}
            optionList={[
              { value: 'HH:mm', label: 'HH:mm' },
              { value: 'HH:mm:ss', label: 'HH:mm:ss' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>时间间隔</label>
          <InputNumber
            value={timePickerField.timeInterval || 30}
            onChange={(value) => updateField({ timeInterval: value })}
            min={1}
            max={60}
          />
        </div>
        <div className="config-item">
          <label>最小时间</label>
          <Input
            value={timePickerField.minTime || ''}
            onChange={(value) => updateField({ minTime: value })}
            placeholder="HH:mm"
          />
        </div>
        <div className="config-item">
          <label>最大时间</label>
          <Input
            value={timePickerField.maxTime || ''}
            onChange={(value) => updateField({ maxTime: value })}
            placeholder="HH:mm"
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={timePickerField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
      </>
    );
  };

  const renderDateTimePickerFieldConfig = () => {
    const dateTimePickerField = field as IDateTimePickerField;
    return (
      <>
        <div className="config-item">
          <label>占位文本</label>
          <Input
            value={dateTimePickerField.placeholder || ''}
            onChange={(value) => updateField({ placeholder: value })}
            placeholder="请输入占位文本"
            maxLength={100}
          />
        </div>
        <div className="config-item">
          <label>默认值</label>
          <DatePicker
            type="dateTime"
            value={dateTimePickerField.defaultValue ? parseDateTime(dateTimePickerField.defaultValue, dateTimePickerField.dateFormat) || undefined : undefined}
            onChange={(date) => {
              let d: Date | null | undefined;
              if (Array.isArray(date)) {
                d = date[0] instanceof Date ? date[0] : parseDateTime(date[0]);
              } else if (typeof date === 'string') {
                d = parseDateTime(date);
              } else {
                d = date;
              }
              updateField({ defaultValue: formatDateTime(d) });
            }}
            placeholder={`${dateTimePickerField.dateFormat || 'YYYY-MM-DD'} ${dateTimePickerField.timeFormat || 'HH:mm'}`}
            style={{ width: '100%' }}
          />
        </div>
        <div className="config-item">
          <label>日期格式</label>
          <Select
            value={dateTimePickerField.dateFormat || 'YYYY-MM-DD'}
            onChange={(value) => updateField({ dateFormat: value })}
            optionList={[
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>时间格式</label>
          <Select
            value={dateTimePickerField.timeFormat || 'HH:mm'}
            onChange={(value) => updateField({ timeFormat: value })}
            optionList={[
              { value: 'HH:mm', label: 'HH:mm' },
              { value: 'HH:mm:ss', label: 'HH:mm:ss' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>时间间隔</label>
          <InputNumber
            value={dateTimePickerField.timeInterval || 30}
            onChange={(value) => updateField({ timeInterval: value })}
            min={1}
            max={60}
          />
        </div>
        <div className="config-item">
          <label>最小日期时间</label>
          <Input
            value={dateTimePickerField.minDateTime || ''}
            onChange={(value) => updateField({ minDateTime: value })}
            placeholder="YYYY-MM-DD HH:mm"
          />
        </div>
        <div className="config-item">
          <label>最大日期时间</label>
          <Input
            value={dateTimePickerField.maxDateTime || ''}
            onChange={(value) => updateField({ maxDateTime: value })}
            placeholder="YYYY-MM-DD HH:mm"
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={dateTimePickerField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
      </>
    );
  };

  const renderCollapseGroupFieldConfig = () => {
    const collapseGroupField = field as IOptionField;
    return (
      <>
        <div className="config-item">
          <label>展开方向</label>
          <Select
            value={(collapseGroupField as any).direction || 'down'}
            onChange={(value) => updateField({ direction: value })}
            optionList={[
              { value: 'down', label: '下' },
              { value: 'right', label: '右' },
              { value: 'up', label: '上' },
              { value: 'left', label: '左' },
            ]}
          />
        </div>
        <div className="config-item">
          <label>最多选中数量</label>
          <InputNumber
            value={collapseGroupField.maxSelect || 1}
            onChange={(value) => updateField({ maxSelect: value })}
            min={0}
          />
        </div>
        <div className="config-item">
          <label>错误提示</label>
          <Input
            value={collapseGroupField.errorMessage || ''}
            onChange={(value) => updateField({ errorMessage: value })}
            placeholder="请输入错误提示"
          />
        </div>
        <div className="config-item">
          <div className="options-header">
            <label>选项列表</label>
            <Button size="small" onClick={addOption}>添加选项</Button>
          </div>
          <div className="options-list">
            {collapseGroupField.options.map((option: IOptionItem, index: number) => (
              <div key={option.id} className="option-item">
                <Input
                  value={option.label}
                  onChange={(value) => updateOption(option.id, { label: value })}
                  placeholder={`选项${index + 1}`}
                />
                <Button
                  type="danger"
                  size="small"
                  onClick={() => deleteOption(option.id)}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };



  const renderFieldConfig = () => {
    switch (field.type) {
      case 'text':
        return renderTextFieldConfig();

      case 'option':
        return renderOptionFieldConfig();
      case 'select':
        return renderSelectFieldConfig();
      case 'multiSelect':
        return renderMultiSelectFieldConfig();
      case 'datePicker':
        return renderDatePickerFieldConfig();
      case 'timePicker':
        return renderTimePickerFieldConfig();
      case 'dateTimePicker':
        return renderDateTimePickerFieldConfig();
      case 'collapseGroup' as FieldType:
        return renderCollapseGroupFieldConfig();
      case 'composite':
        return renderCompositeFieldConfig();
      default:
        return null;
    }
  };

  const renderCompositeFieldConfig = () => {
    const compositeField = field as any;
    
    // 获取可用的子组件列表（排除组合组件和当前组合组件本身）
    const availableFields = allFields.filter(f => 
      f.id !== field.id && 
      f.type !== 'composite' && 
      !compositeField.children.includes(f.id)
    );

    // 添加子组件
    const handleAddChild = (childId: string) => {
      if (compositeField.children.length >= compositeField.maxChildren) {
        return;
      }
      
      const newChildren = [...compositeField.children, childId];
      let newRatios = compositeField.widthRatios;
      
      // 自动调整宽度比例
      if (newChildren.length > 1) {
        const ratios = compositeField.widthRatios.split(':').map((r: string) => r.trim());
        if (ratios.length === newChildren.length - 1) {
          newRatios = [...ratios, '1'].join(':');
        }
      }
      
      updateField({ children: newChildren, widthRatios: newRatios });
    };

    // 移除子组件
    const handleRemoveChild = (index: number) => {
      const newChildren = compositeField.children.filter((_: any, i: number) => i !== index);
      let newRatios = compositeField.widthRatios;
      
      // 自动调整宽度比例
      if (newChildren.length > 0) {
        const ratios = compositeField.widthRatios.split(':').map((r: string) => r.trim());
        if (ratios.length === newChildren.length + 1) {
          newRatios = ratios.filter((_: any, i: number) => i !== index).join(':');
        }
      }
      
      updateField({ children: newChildren, widthRatios: newRatios });
    };

    // 更新宽度比例
    const handleUpdateRatios = (ratios: string) => {
      updateField({ widthRatios: ratios });
    };

    // 获取子组件信息
    const getChildFieldInfo = (childId: string) => {
      return allFields.find(f => f.id === childId);
    };

    return (
      <>
        <div className="config-item">
          <label>组件占比</label>
          <Input
            value={compositeField.widthRatios}
            onChange={(value) => handleUpdateRatios(value)}
            placeholder="例如: 1:1:1, 2:1, auto:1"
            maxLength={50}
          />
          <div style={{ fontSize: '12px', color: 'var(--ccm-chart-N600)', marginTop: '8px' }}>
            支持格式: "1:1:1" (等宽), "2:1" (比例), "auto:1" (自适应)
          </div>
        </div>
        
        <div className="config-item">
          <div className="options-header">
              <label>子组件管理</label>
              <Select
                value={undefined}
                placeholder="添加子组件"
                onSelect={(value) => value && handleAddChild(value as string)}
                optionList={availableFields.map(f => ({
                  value: f.id,
                  label: f.name
                }))}
                style={{ marginLeft: '8px', width: '200px' }}
              />
            </div>
          
          <div className="options-list">
            {compositeField.children.map((childId: string, index: number) => {
              const childField = getChildFieldInfo(childId);
              if (!childField) return null;
              
              return (
                <div key={childId} className="option-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>{childField.name} (ID: {childId})</span>
                    <Button
                      type="warning"
                      size="small"
                      onClick={() => handleRemoveChild(index)}
                    >
                      退出
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {compositeField.children.length === 0 && (
            <div style={{ fontSize: '12px', color: 'var(--ccm-chart-N600)', marginTop: '8px' }}>
              暂无子组件，请添加子组件
            </div>
          )}
          
          <div style={{ fontSize: '12px', color: 'var(--ccm-chart-N600)', marginTop: '8px' }}>
            已添加 {compositeField.children.length} / {compositeField.maxChildren} 个子组件
          </div>
        </div>
      </>
    );
  };

  const renderParentLinkConfig = () => {
    if (field.type === 'option') {
      return null;
    }

    return (
      <>
        <div className="config-item">
          <label>父级关联</label>
          <Switch
            checked={field.enableParentLink || false}
            onChange={(checked) => {
              if (!checked) {
                updateField({ enableParentLink: checked, parentFieldId: undefined, parentOptionValue: undefined });
              } else {
                updateField({ enableParentLink: checked });
              }
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--ccm-chart-N600)', lineHeight: '1.5', marginTop: '8px' }}>
            开启后可选择父级选项字段，当父级选项被选中时该字段才会显示。仅支持关联选项输入框类型的字段。
          </div>
        </div>
        {field.enableParentLink && (
          <>
            <div className="config-item">
              <label>父级选项字段</label>
              <Select
                value={field.parentFieldId || ''}
                onChange={(value) => {
                  updateField({ parentFieldId: value as string, parentOptionValue: undefined });
                }}
                placeholder="选择父级选项字段"
                optionList={allFields
                  .filter(f => f.id !== field?.id && f.type === 'option')
                  .map(f => ({
                    value: f.id,
                    label: f.name,
                  }))}
                showClear
              />
            </div>
            {field.parentFieldId && (
              <div className="config-item">
                <label>父级选项值</label>
                <Select
                  value={field.parentOptionValue || ''}
                  onChange={(value) => updateField({ parentOptionValue: value as string })}
                  placeholder="选择父级选项值"
                  optionList={allFields
                    .find(f => f.id === field.parentFieldId)
                    ? (allFields.find(f => f.id === field.parentFieldId) as IOptionField).options.map(opt => ({
                        value: opt.value || opt.label,
                        label: opt.label,
                      }))
                    : []
                  }
                  showClear
                />
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="field-config-panel">
      <Card className="config-card">
        <div className="config-body">
          {/* 渲染通用配置，组合组件也需要字段名称配置 */}
          {renderCommonConfig()}
          {renderFieldConfig()}
          {/* 组合组件支持父级关联配置 */}
          {renderParentLinkConfig()}
        </div>
      </Card>
    </div>
  );
}
