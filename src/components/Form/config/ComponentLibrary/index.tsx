import React from 'react';
import { Button, Card } from '@douyinfe/semi-ui';
import { ComponentLibraryItem, FieldType } from '../../../../types';
import { generateId } from '../../../../utils';

interface ComponentLibraryProps {
  onAddField: (type: FieldType) => void;
}

export default function ComponentLibrary({ onAddField }: ComponentLibraryProps) {
  const components: ComponentLibraryItem[] = [
    {
      type: 'text',
      name: '输入框',
      icon: '✏️',
      description: '单行文本输入框',
      defaultConfig: {
        type: 'text',
        name: '输入框',
        required: false,
        order: 0,
        placeholder: '请输入',
        maxLength: 200,
        inputType: 'none',
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'option',
      name: '选项输入框',
      icon: '🔘',
      description: '单选/多选/标签',
      defaultConfig: {
        type: 'option',
        name: '选项输入框',
        required: false,
        order: 0,
        optionType: 'radio',
        options: [
          { id: generateId(), label: '选项1', order: 0 },
          { id: generateId(), label: '选项2', order: 1 },
        ],
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'select',
      name: '下拉选择',
      icon: '📋',
      description: '下拉单选框',
      defaultConfig: {
        type: 'select',
        name: '下拉选择',
        required: false,
        order: 0,
        placeholder: '请选择',
        options: [
          { id: generateId(), label: '选项1', order: 0 },
          { id: generateId(), label: '选项2', order: 1 },
        ],
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'multiSelect',
      name: '下拉多选',
      icon: '☑️',
      description: '下拉多选框',
      defaultConfig: {
        type: 'multiSelect',
        name: '下拉多选',
        required: false,
        order: 0,
        placeholder: '请选择',
        options: [
          { id: generateId(), label: '选项1', order: 0 },
          { id: generateId(), label: '选项2', order: 1 },
        ],
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'datePicker',
      name: '日期选择器',
      icon: '📅',
      description: '日期选择框',
      defaultConfig: {
        type: 'datePicker',
        name: '日期选择器',
        required: false,
        order: 0,
        placeholder: '请选择日期',
        dateFormat: 'YYYY-MM-DD',
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'timePicker',
      name: '时间选择器',
      icon: '⏰',
      description: '时间选择框',
      defaultConfig: {
        type: 'timePicker',
        name: '时间选择器',
        required: false,
        order: 0,
        placeholder: '请选择时间',
        timeFormat: 'HH:mm',
        timeInterval: 30,
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'dateTimePicker',
      name: '日期时间选择器',
      icon: '🕐',
      description: '日期时间选择框',
      defaultConfig: {
        type: 'dateTimePicker',
        name: '日期时间选择器',
        required: false,
        order: 0,
        placeholder: '请选择日期时间',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeInterval: 30,
        align: 'left',
        width: 'auto',
      },
    },
    {
      type: 'composite',
      name: '组合组件',
      icon: '📦',
      description: '组合其他组件，支持多列布局',
      defaultConfig: {
        type: 'composite',
        name: '组合组件',
        required: false,
        order: 0,
        children: [],
        widthRatios: '1:1',
        maxChildren: 4,
      },
    },
  ];

  return (
    <div className="component-library">
      <div className="component-grid">
        {components.map((component) => (
          <div
            key={component.type}
            className="component-card"
            onClick={() => onAddField(component.type)}
          >
            <div className="component-icon">{component.icon}</div>
            <div className="component-info">
              <div className="component-name">{component.name}</div>
              <div className="component-description">{component.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
