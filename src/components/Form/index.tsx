import './style.scss';
import React, { useState, useEffect } from 'react';
import { DashboardState } from '@lark-base-open/js-sdk';
import { Toast, Tabs, TabPane, Button, Modal, Input, InputNumber, Select, Switch } from '@douyinfe/semi-ui';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useFormConfig, useFormValidation, useFormSubmit } from '../../hooks';
import { IFormConfig, IFormField, FieldType } from '../../types';
import TextField from './fields/TextField';
import OptionField from './fields/OptionField';
import SelectField from './fields/SelectField';
import MultiSelectField from './fields/MultiSelectField';
import DatePickerField from './fields/DatePickerField';
import TimePickerField from './fields/TimePickerField';
import DateTimePickerField from './fields/DateTimePickerField';
import CompositeField from './fields/CompositeField';
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
            <label>组件间距</label>
            <InputNumber
              value={config.fieldSpacing}
              onChange={(value) => setConfig({ ...config, fieldSpacing: value || 12 })}
              min={1}
              max={64}
            />
          </div>
        </div>

        <div className="config-group">
          <div className="config-group-title">样式</div>
          <div className="config-section">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                checked={config.showBorder}
                onChange={(checked) => setConfig({ ...config, showBorder: checked })}
              />
              <span style={{ marginLeft: 8 }}>显示边框</span>
            </div>
          </div>
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
            <label>圆角大小</label>
            <InputNumber
              value={config.borderRadius}
              onChange={(value) => setConfig({ ...config, borderRadius: value || 8 })}
              min={0}
              max={16}
            />
          </div>
          <div className="config-section">
            <label>边距</label>
            <InputNumber
              value={config.padding}
              onChange={(value) => setConfig({ ...config, padding: value || 16 })}
              min={0}
              max={64}
            />
          </div>
        </div>

        <div className="config-group">
          <div className="config-group-title">提交按钮</div>
          <div className="config-section">
            <label>按钮文本</label>
            <Input
              value={config.submitButton.text}
              onChange={(value) => setConfig({ ...config, submitButton: { ...config.submitButton, text: value } })}
              maxLength={20}
            />
          </div>
          <div className="config-section">
            <label>提交成功提示</label>
            <Input
              value={config.submitButton.successMessage}
              onChange={(value) => setConfig({ ...config, submitButton: { ...config.submitButton, successMessage: value } })}
              maxLength={50}
            />
          </div>
          <div className="config-section">
            <label>提交后操作</label>
            <Select
              value={config.submitButton.afterSubmit}
              onChange={(value) => setConfig({ ...config, submitButton: { ...config.submitButton, afterSubmit: value } })}
              optionList={[
                { value: 'reset', label: '重置表单' },
                { value: 'disable', label: '禁用表单' },
                { value: 'keep', label: '保持表单' }
              ]}
            />
          </div>
          <div className="config-section">
            <label>对齐方式</label>
            <Select
              value={config.submitButton.align || 'left'}
              onChange={(value) => setConfig({ ...config, submitButton: { ...config.submitButton, align: value } })}
              optionList={[
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'right', label: '右对齐' }
              ]}
            />
          </div>
          <div className="config-section">
            <label>宽度</label>
            <Select
              value={config.submitButton.width || 'full'}
              onChange={(value) => setConfig({ ...config, submitButton: { ...config.submitButton, width: value } })}
              optionList={[
                { value: 'auto', label: '自适应' },
                { value: 'full', label: '占满' }
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
    composite: '组合组件',
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

  // 获取所有被组合组件引用的子组件ID
  const getCompositeChildIds = (): string[] => {
    const compositeFields = config.fields.filter(f => f.type === 'composite') as any[];
    const childIds: string[] = [];
    compositeFields.forEach(compositeField => {
      childIds.push(...compositeField.children);
    });
    return childIds;
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
      align: 'left',
      width: 'auto',
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
      case 'composite':
        Object.assign(newField, {
          children: [],
          widthRatios: '1:1',
          maxChildren: config.width === 'full' ? 8 : 4,
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
      // 同时从所有组合组件的children数组中移除被删除的字段ID
      submitButton: config.submitButton,
    });
    
    // 单独处理组合组件的children更新
    const updatedFields = config.fields.map(field => {
      if (field.type === 'composite') {
        const compositeField = field as any;
        return {
          ...compositeField,
          children: compositeField.children.filter((childId: string) => childId !== fieldToDelete)
        };
      }
      return field;
    }).filter(field => field.id !== fieldToDelete);
    
    setConfig({
      ...config,
      fields: updatedFields
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

  // 构建组件的层级结构
  const buildComponentHierarchy = () => {
    // 首先找出所有组合组件
    const compositeFields = config.fields.filter(f => f.type === 'composite') as any[];
    
    // 创建一个映射，记录每个字段的父组件ID
    const childToParentMap: Record<string, string> = {};
    compositeFields.forEach(compositeField => {
      compositeField.children.forEach((childId: string) => {
        childToParentMap[childId] = compositeField.id;
      });
    });
    
    // 构建层级结构
    const hierarchy: { field: IFormField; children?: typeof config.fields }[] = [];
    
    // 先添加所有非子组件的组件
    config.fields.forEach(field => {
      if (!childToParentMap[field.id]) {
        hierarchy.push({ field });
      }
    });
    
    // 为每个组合组件添加它的子组件
    hierarchy.forEach(item => {
      if (item.field.type === 'composite') {
        const compositeField = item.field as any;
        item.children = compositeField.children
          .map((childId: string) => config.fields.find(f => f.id === childId))
          .filter((child: any): child is IFormField => child !== undefined);
      }
    });
    
    return hierarchy;
  };

  // 处理拖拽结束事件
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // 如果没有目标位置，或者拖拽到同一个位置，就不做任何操作
    if (!destination || (source.index === destination.index)) {
      return;
    }

    // 更新字段顺序
    const newFields = Array.from(config.fields);
    const [removed] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, removed);

    // 更新每个字段的 order 属性
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index
    }));

    // 更新配置
    setConfig({
      ...config,
      fields: updatedFields
    });
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
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
          <div key={field.id} data-field-id={field.id} style={{ textAlign: field.align || 'left' }}>
            <DateTimePickerField
              field={field as any}
              value={value || ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={error}
              disabled={isFormDisabled}
            />
          </div>
        );
      case 'composite':
        return (
          <div key={field.id} data-field-id={field.id} style={{ width: '100%' }}>
            <CompositeField
              field={field as any}
              allFields={config.fields}
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleFieldBlur={handleFieldBlur}
              errors={errors}
              isFormDisabled={isFormDisabled}
              isFieldVisible={isFieldVisible}
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

  return (
    <main style={{ backgroundColor: bgColor }} className={classnames({ 'main-config': isConfig, 'main': true })}>
      <div className="content">
        <div
          className="form-container"
          style={{
            width: getFormWidth(),
            alignItems: 'stretch',
            padding: `${config.padding}px`,
            border: config.showBorder ? '1px solid var(--divider)' : 'none',
            boxShadow: config.showShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            borderRadius: `${config.borderRadius}px`,
            gap: `${config.fieldSpacing}px`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >

          {config.description && <p className="form-description">{config.description}</p>}
          {config.fields.sort((a, b) => a.order - b.order).filter(field => isFieldVisible(field) && !getCompositeChildIds().includes(field.id)).map((field) => renderField(field))}
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
              {/* 直接使用扁平的组件列表进行拖拽排序，但按层级展示 */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields-list" direction="vertical">
                  {(provided) => {
                    // 先获取所有组合组件
                    const compositeFields = config.fields.filter(f => f.type === 'composite') as any[];
                    // 创建子组件到父组件的映射
                    const childToParentMap: Record<string, string> = {};
                    compositeFields.forEach(compositeField => {
                      compositeField.children.forEach((childId: string) => {
                        childToParentMap[childId] = compositeField.id;
                      });
                    });
                    
                    // 创建父组件到子组件的映射
                    const parentToChildrenMap: Record<string, string[]> = {};
                    compositeFields.forEach(compositeField => {
                      parentToChildrenMap[compositeField.id] = compositeField.children;
                    });
                    
                    // 筛选出所有非子组件（顶级组件）
                    const topLevelFields = config.fields.filter(field => !childToParentMap[field.id]);
                    
                    return (
                      <div
                        className="fields-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {/* 渲染所有顶级组件，包括组合组件 */}
                        {topLevelFields.map((field, parentIndex) => {
                          // 计算该顶级组件在扁平列表中的实际索引
                          const flatIndex = config.fields.findIndex(f => f.id === field.id);
                          
                          return (
                            <React.Fragment key={field.id}>
                              {/* 渲染顶级组件 */}
                              <Draggable key={field.id} draggableId={field.id} index={flatIndex}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`field-item ${selectedField?.id === field.id ? 'selected' : ''}`}
                                    onClick={() => handleFieldClick(field)}
                                    style={{
                                      ...provided.draggableProps.style,
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginLeft: '0',
                                      borderLeft: 'none',
                                      paddingLeft: '0',
                                      opacity: 1
                                    }}
                                  >
                                    {/* 拖拽手柄 */}
                                    <span
                                      {...provided.dragHandleProps}
                                      style={{
                                        cursor: 'grab',
                                        marginRight: '8px',
                                        padding: '4px',
                                        userSelect: 'none',
                                        color: 'inherit'
                                      }}
                                    >
                                      ☰
                                    </span>
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
                                )}
                              </Draggable>
                              
                              {/* 如果是组合组件，渲染它的子组件 */}
                              {field.type === 'composite' && parentToChildrenMap[field.id] && parentToChildrenMap[field.id].length > 0 && (
                                <div className="composite-children">
                                  {parentToChildrenMap[field.id].map((childId, childIndex) => {
                                    const childField = config.fields.find(f => f.id === childId);
                                    if (!childField) return null;
                                    
                                    // 计算该子组件在扁平列表中的实际索引
                                    const childFlatIndex = config.fields.findIndex(f => f.id === childId);
                                    
                                    return (
                                      <Draggable key={childField.id} draggableId={childField.id} index={childFlatIndex}>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`field-item ${selectedField?.id === childField.id ? 'selected' : ''}`}
                                            onClick={() => handleFieldClick(childField)}
                                            style={{
                                              ...provided.draggableProps.style,
                                              display: 'flex',
                                              alignItems: 'center',
                                              marginLeft: '24px',
                                              borderLeft: '2px solid #d9d9d9',
                                              paddingLeft: '12px',
                                              opacity: 0.8
                                            }}
                                          >
                                            {/* 子组件禁止拖拽 - 移除拖拽手柄 */}
                                            <span
                                              style={{
                                                marginRight: '8px',
                                                padding: '4px',
                                                userSelect: 'none',
                                                color: '#999'
                                              }}
                                            >
                                              ⋮
                                            </span>
                                            <span className="field-type">{getFieldTypeName(childField.type)}</span>
                                            <span className="field-name">{childField.name}</span>
                                            <Button
                                              type="warning"
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // 从组合组件中移除子组件（退出组合组件）
                                                const compositeField = config.fields.find(f => f.id === field.id) as any;
                                                if (compositeField) {
                                                  const newChildren = compositeField.children.filter((id: string) => id !== childField.id);
                                                  let newRatios = compositeField.widthRatios;
                                                  
                                                  // 自动调整宽度比例
                                                  if (newChildren.length > 0) {
                                                    const ratios = compositeField.widthRatios.split(':').map((r: string) => r.trim());
                                                    if (ratios.length === newChildren.length + 1) {
                                                      newRatios = ratios.filter((_: any, i: number) => i !== compositeField.children.indexOf(childField.id)).join(':');
                                                    }
                                                  }
                                                  
                                                  // 更新组合组件配置
                                                  const updatedCompositeField = {
                                                    ...compositeField,
                                                    children: newChildren,
                                                    widthRatios: newRatios
                                                  };
                                                  
                                                  // 更新配置
                                                  setConfig({
                                                    ...config,
                                                    fields: config.fields.map(f => f.id === compositeField.id ? updatedCompositeField : f)
                                                  });
                                                  
                                                  // 如果当前选中的是这个组合组件，重新选择它以更新配置面板
                                                  if (selectedField?.id === compositeField.id) {
                                                    setSelectedField(updatedCompositeField as IFormField);
                                                  }
                                                }
                                              }}
                                            >
                                              退出
                                            </Button>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
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