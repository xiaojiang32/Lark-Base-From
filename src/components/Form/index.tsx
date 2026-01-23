import './style.scss';
import React, { useState, useEffect } from 'react';
import { DashboardState } from '@lark-base-open/js-sdk';
import { Toast, Tabs, TabPane, Button, Modal, Input, InputNumber, Select, Switch } from '@douyinfe/semi-ui';
import { useFormConfig, useFormValidation, useFormSubmit } from '../../hooks';
import { IFormConfig, IFormField, FieldType } from '../../types';
import TextField from './fields/TextField';
import OptionField from './fields/OptionField';
import SelectField from './fields/SelectField';
import MultiSelectField from './fields/MultiSelectField';
import DatePickerField from './fields/DatePickerField';
import TimePickerField from './fields/TimePickerField';
import DateTimePickerField from './fields/DateTimePickerField';
import SubmitButton from './fields/SubmitButton';
import ComponentLibrary from './config/ComponentLibrary';
import FieldConfigPanel from './config/FieldConfigPanel';
import SubmitConfigPanel from './config/SubmitConfigPanel';
import { generateId } from '../../utils';

function GlobalConfigPanel({ config, setConfig, saveConfig }: any) {
  return (
    <div className="global-config-panel">
      <div className="form">
        <div className="config-group">
          <div className="config-group-title">基础信息</div>
          <div className="config-section" style={{ gridColumn: '1 / -1' }}>
            <label>表单标题</label>
            <Input
              value={config.title || ''}
              onChange={(value) => setConfig({ ...config, title: value })}
              placeholder="请输入表单标题"
              maxLength={50}
            />
          </div>
          <div className="config-section">
            <label>表单宽度</label>
            <Select
              value={config.width}
              onChange={(value) => setConfig({ ...config, width: value })}
              optionList={[
                { value: 'narrow', label: '窄 (300px)' },
                { value: 'standard', label: '标准 (500px)' },
                { value: 'wide', label: '宽 (700px)' },
                { value: 'full', label: '全宽 (100%)' }
              ]}
            />
          </div>
          <div className="config-section">
            <label>表单对齐</label>
            <Select
              value={config.align}
              onChange={(value) => setConfig({ ...config, align: value })}
              optionList={[
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'right', label: '右对齐' }
              ]}
            />
          </div>
          <div className="config-section">
            <label>布局模式</label>
            <Select
              value={config.layoutMode}
              onChange={(value) => setConfig({ ...config, layoutMode: value })}
              optionList={[
                { value: 'single', label: '单列布局' },
                { value: 'double', label: '两列布局' }
              ]}
            />
          </div>
          <div className="config-section">
            <label>字段间距</label>
            <InputNumber
              value={config.fieldSpacing}
              onChange={(value) => setConfig({ ...config, fieldSpacing: value || 4 })}
              min={1}
              max={16}
            />
          </div>
        </div>

        <div className="config-group">
          <div className="config-group-title">样式</div>
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                checked={config.showShadow}
                onChange={(checked) => setConfig({ ...config, showShadow: checked })}
              />
              <span style={{ marginLeft: 8 }}>显示阴影</span>
            </div>
          </div>
          <div className="config-section">
            <label>背景颜色</label>
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
            />
          </div>
          <div className="config-section">
            <label>圆角大小</label>
            <InputNumber
              value={config.borderRadius}
              onChange={(value) => setConfig({ ...config, borderRadius: value || 8 })}
              min={0}
              max={16}
            />
          </div>
        </div>

        <div className="config-group">
          <div className="config-group-title">提交按钮</div>
          <div className="config-section">
            <label>按钮文本</label>
            <Input
              value={config.submitButton.text}
              onChange={(value) => setConfig({
                ...config,
                submitButton: { ...config.submitButton, text: value }
              })}
              maxLength={20}
            />
          </div>
          <div className="config-section">
            <label>提交成功提示</label>
            <Input
              value={config.submitButton.successMessage}
              onChange={(value) => setConfig({
                ...config,
                submitButton: { ...config.submitButton, successMessage: value }
              })}
              maxLength={50}
            />
          </div>
          <div className="config-section">
            <label>提交后操作</label>
            <Select
              value={config.submitButton.afterSubmit}
              onChange={(value) => setConfig({
                ...config,
                submitButton: { ...config.submitButton, afterSubmit: value }
              })}
              optionList={[
                { value: 'reset', label: '重置表单' },
                { value: 'disable', label: '禁用表单' },
                { value: 'keep', label: '保持表单' }
              ]}
            />
          </div>
        </div>

        <Button type="primary" theme="solid" onClick={saveConfig} style={{ width: '100%', marginTop: 20 }}>
          保存
        </Button>
      </div>
    </div>
  );
}

function getFieldTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    text: '输入框',
    option: '选项输入框',
    select: '下拉选择',
    multiSelect: '下拉多选',
    datePicker: '日期选择器',
    timePicker: '时间选择器',
    dateTimePicker: '日期时间选择器',
  };
  return typeMap[type] || type;
}

function classnames(obj: Record<string, boolean>): string {
  return Object.keys(obj)
    .filter(key => obj[key])
    .join(' ');
}

interface FormProps {
  bgColor: string;
}

export default function Form({ bgColor }: FormProps) {
  const { config, setConfig, mode, saveConfig } = useFormConfig();
  const { errors, isValid, validateFieldById, validateAll, clearErrors } = useFormValidation(config.fields);
  const { isSubmitting, submitResult, submitForm, registerHooks } = useFormSubmit(config);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [selectedField, setSelectedField] = useState<IFormField | null>(null);
  const [activeTab, setActiveTab] = useState<string>('global');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string>('');

  useEffect(() => {
    registerHooks({
      onMount: ({ form }) => {
        console.log('Form mounted:', form);
      },
      onChange: ({ id, value, form }) => {
        console.log(`Field ${id} changed:`, value);
      },
      onValidate: ({ errors }) => {
        console.log('Validation errors:', errors);
        return true;
      },
      onSubmit: ({ values }) => {
        console.log('Form submitted:', values);
        return true;
      },
      onError: ({ errors }) => {
        console.log('Submit errors:', errors);
      },
    });
  }, []);

  useEffect(() => {
    const initialFormData: Record<string, any> = {};
    config.fields.forEach(field => {
      if (field.type === 'text') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'option') {
        const optionField = field as any;
        if (optionField.optionType === 'checkbox') {
          initialFormData[field.id] = optionField.options
            .filter((opt: any) => opt.defaultChecked)
            .map((opt: any) => opt.value || opt.label);
        } else {
          const defaultOption = optionField.options.find((opt: any) => opt.defaultChecked);
          initialFormData[field.id] = defaultOption ? (defaultOption.value || defaultOption.label) : '';
        }
      } else if (field.type === 'select') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'multiSelect') {
        initialFormData[field.id] = (field as any).defaultValue || [];
      } else if (field.type === 'datePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'timePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'dateTimePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'collapseGroup') {
        const collapseField = field as any;
        if (collapseField.maxSelect !== 1) {
          initialFormData[field.id] = collapseField.options
            .filter((opt: any) => opt.defaultChecked)
            .map((opt: any) => opt.value || opt.label);
        } else {
          const defaultOption = collapseField.options.find((opt: any) => opt.defaultChecked);
          initialFormData[field.id] = defaultOption ? (defaultOption.value || defaultOption.label) : '';
        }
      }
    });
    setFormData(initialFormData);
  }, [config.fields]);

  // 根据飞书平台的 mode 状态决定是否显示配置面板
  // 创建状态和配置状态显示配置面板，展示状态和全屏状态不显示
  const isConfig = mode === DashboardState.Config || mode === DashboardState.Create;

  // 临时设置：任何状态下都显示配置面板
  //const isConfig = true;

  // 检查字段是否应该显示（基于父级选项的关联关系）
  const isFieldVisible = (field: IFormField): boolean => {
    // 如果没有父级字段，则始终显示
    if (!field.parentFieldId) {
      return true;
    }

    // 获取父级字段的值
    const parentValue = formData[field.parentFieldId];

    // 如果父级字段没有值，则不显示
    if (!parentValue) {
      return false;
    }

    // 检查父级选项的值是否匹配
    if (Array.isArray(parentValue)) {
      // 多选情况：只要选中了匹配的选项就显示
      return parentValue.includes(field.parentOptionValue);
    } else {
      // 单选情况：值匹配才显示
      return parentValue === field.parentOptionValue;
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    validateFieldById(fieldId, value);
  };

  const handleFieldBlur = (fieldId: string) => {
    validateFieldById(fieldId, formData[fieldId]);
  };

  const scrollToFirstError = () => {
    const firstErrorFieldId = Object.keys(errors).find(fieldId => errors[fieldId]);
    if (firstErrorFieldId) {
      const element = document.querySelector(`[data-field-id="${firstErrorFieldId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputElement = element.querySelector('input, select, textarea');
        if (inputElement) {
          (inputElement as HTMLElement).focus();
        }
      }
    }
  };

  const handleAddField = (type: FieldType) => {
    const newField: IFormField = {
      id: generateId(type),
      type,
      name: '新字段',
      required: false,
      order: config.fields.length,
      labelSpacing: 8,
    };

    switch (type) {
      case 'text':
        Object.assign(newField, {
          placeholder: '请输入',
          maxLength: 200,
          inputType: 'none',
        });
        break;
      case 'option':
        Object.assign(newField, {
          optionType: 'radio',
          options: [
            { id: generateId('option'), label: '选项1', order: 0 },
            { id: generateId('option'), label: '选项2', order: 1 },
          ],
        });
        break;
      case 'select':
        Object.assign(newField, {
          placeholder: '请选择',
          options: [
            { id: generateId('select'), label: '选项1', order: 0 },
            { id: generateId('select'), label: '选项2', order: 1 },
          ],
        });
        break;
      case 'multiSelect':
        Object.assign(newField, {
          placeholder: '请选择',
          options: [
            { id: generateId('multiSelect'), label: '选项1', order: 0 },
            { id: generateId('multiSelect'), label: '选项2', order: 1 },
          ],
        });
        break;
      case 'datePicker':
        Object.assign(newField, {
          placeholder: '请选择日期',
          dateFormat: 'YYYY-MM-DD',
        });
        break;
      case 'timePicker':
        Object.assign(newField, {
          placeholder: '请选择时间',
          timeFormat: 'HH:mm',
          timeInterval: 30,
        });
        break;
      case 'dateTimePicker':
        Object.assign(newField, {
          placeholder: '请选择日期时间',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          timeInterval: 30,
        });
        break;
      case 'collapseGroup' as FieldType:
        Object.assign(newField, {
          direction: 'down',
          maxSelect: 1,
          options: [
            { id: generateId('collapseGroup'), label: '选项1', order: 0 },
            { id: generateId('collapseGroup'), label: '选项2', order: 1 },
          ],
        });
        break;
    }

    setConfig({
      ...config,
      fields: [...config.fields, newField as any],
    });
    setSelectedField(newField);
    setActiveTab('config');
  };

  const handleUpdateField = (updatedField: IFormField & { _originalId?: string }) => {
    const { _originalId, ...fieldData } = updatedField;
    const targetId = _originalId || updatedField.id;
    
    setConfig({
      ...config,
      fields: config.fields.map(field =>
        field.id === targetId ? fieldData as IFormField : field
      ),
    });
    setSelectedField(fieldData as IFormField);
  };

  const handleDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteField = () => {
    setConfig({
      ...config,
      fields: config.fields.filter(field => field.id !== fieldToDelete),
    });
    if (selectedField?.id === fieldToDelete) {
      setSelectedField(null);
    }
    setDeleteConfirmVisible(false);
    setFieldToDelete('');
  };

  const cancelDeleteField = () => {
    setDeleteConfirmVisible(false);
    setFieldToDelete('');
  };

  const handleFieldClick = (field: IFormField) => {
    setSelectedField(field);
    setActiveTab('config');
  };

  const handleSubmit = async () => {
    const isValid = validateAll(formData);
    if (!isValid) {
      Toast.error('请检查表单填写是否正确');
      scrollToFirstError();
      return;
    }

    const result = await submitForm(formData);

    if (result?.success) {
      Toast.success(submitResult?.message || config.submitButton.successMessage);

      switch (config.submitButton.afterSubmit) {
        case 'reset':
          resetForm();
          break;
        case 'disable':
          setIsFormDisabled(true);
          break;
        case 'keep':
          break;
      }
    } else {
      Toast.error(submitResult?.message || '提交失败');
    }
  };

  const resetForm = () => {
    const initialFormData: Record<string, any> = {};
    config.fields.forEach(field => {
      if (field.type === 'text') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'option') {
        const optionField = field as any;
        if (optionField.optionType === 'checkbox') {
          initialFormData[field.id] = optionField.options
            .filter((opt: any) => opt.defaultChecked)
            .map((opt: any) => opt.value || opt.label);
        } else {
          const defaultOption = optionField.options.find((opt: any) => opt.defaultChecked);
          initialFormData[field.id] = defaultOption ? (defaultOption.value || defaultOption.label) : '';
        }
      } else if (field.type === 'select') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'multiSelect') {
        initialFormData[field.id] = (field as any).defaultValue || [];
      } else if (field.type === 'datePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'timePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'dateTimePicker') {
        initialFormData[field.id] = (field as any).defaultValue || '';
      } else if (field.type === 'collapseGroup') {
        const collapseField = field as any;
        if (collapseField.maxSelect !== 1) {
          initialFormData[field.id] = collapseField.options
            .filter((opt: any) => opt.defaultChecked)
            .map((opt: any) => opt.value || opt.label);
        } else {
          const defaultOption = collapseField.options.find((opt: any) => opt.defaultChecked);
          initialFormData[field.id] = defaultOption ? (defaultOption.value || defaultOption.label) : '';
        }
      }
    });
    setFormData(initialFormData);
    clearErrors();
    setIsFormDisabled(false);
  };

  const renderField = (field: IFormField) => {
    const value = formData[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} data-field-id={field.id}>
            <TextField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              onBlur={() => handleFieldBlur(field.id)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'option':
        return (
          <div key={field.id} data-field-id={field.id}>
            <OptionField
              field={field as any}
              value={value}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.id} data-field-id={field.id}>
            <SelectField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'multiSelect':
        return (
          <div key={field.id} data-field-id={field.id}>
            <MultiSelectField
              field={field as any}
              value={value || []}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'datePicker':
        return (
          <div key={field.id} data-field-id={field.id}>
            <DatePickerField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'timePicker':
        return (
          <div key={field.id} data-field-id={field.id}>
            <TimePickerField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'dateTimePicker':
        return (
          <div key={field.id} data-field-id={field.id}>
            <DateTimePickerField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getFormWidth = () => {
    switch (config.width) {
      case 'narrow':
        return '300px';
      case 'standard':
        return '500px';
      case 'wide':
        return '700px';
      case 'full':
        return '100%';
      default:
        return '500px';
    }
  };

  const getFormAlign = () => {
    switch (config.align) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  };

  return (
    <main style={{ backgroundColor: bgColor }} className={classnames({ 'main-config': isConfig, 'main': true })}>
      <div className="content">
        <div
          className={`form-container ${config.layoutMode === 'double' ? 'form-container-double' : ''}`}
          style={{
            width: getFormWidth(),
            alignItems: getFormAlign(),
            padding: '16px',
            border: '1px solid var(--divider)',
            boxShadow: config.showShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            backgroundColor: config.backgroundColor,
            borderRadius: `${config.borderRadius}px`,
            gap: `${config.fieldSpacing}px`,
            display: config.layoutMode === 'double' ? 'grid' : 'flex',
            gridTemplateColumns: config.layoutMode === 'double' ? '1fr 1fr' : 'auto',
            flexDirection: config.layoutMode === 'double' ? 'row' : 'column',
          }}
        >
          {config.title && <h2 className="form-title">{config.title}</h2>}
          {config.description && <p className="form-description">{config.description}</p>}
          {config.fields.sort((a, b) => a.order - b.order).filter(isFieldVisible).map((field) => renderField(field))}
          <SubmitButton
            config={config.submitButton}
            onClick={handleSubmit}
            disabled={isFormDisabled}
            loading={isSubmitting}
          />
        </div>
      </div>

      {isConfig && (
        <div className="config-panel">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="配置" itemKey="global">
              <GlobalConfigPanel config={config} setConfig={setConfig} saveConfig={saveConfig} />
            </TabPane>
            <TabPane tab="组件" itemKey="library">
              <ComponentLibrary onAddField={handleAddField} />
            </TabPane>
            <TabPane tab="组件配置" itemKey="config">
              <div className="fields-list">
                {config.fields.map((field) => (
                  <div
                    key={field.id}
                    className={`field-item ${selectedField?.id === field.id ? 'selected' : ''}`}
                    onClick={() => handleFieldClick(field)}
                  >
                    <span className="field-type">{getFieldTypeName(field.type)}</span>
                    <span className="field-name">{field.name}</span>
                    <Button
                      type="danger"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                ))}
              </div>
              {selectedField && (
                <FieldConfigPanel
                  field={selectedField}
                  onUpdateField={handleUpdateField}
                  onDeleteField={handleDeleteField}
                  allFields={config.fields}
                />
              )}
            </TabPane>
            <TabPane tab="数据提交" itemKey="submit">
              <SubmitConfigPanel config={config} setConfig={setConfig} fields={config.fields} />
            </TabPane>
          </Tabs>
        </div>
      )}

      <Modal
        title="确认删除"
        visible={deleteConfirmVisible}
        onOk={confirmDeleteField}
        onCancel={cancelDeleteField}
        okText="确定"
        cancelText="取消"
      >
        确定要删除这个字段吗？
      </Modal>
    </main>
  );
}
