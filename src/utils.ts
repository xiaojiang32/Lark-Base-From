import { IFormField, ITextField, IOptionField, IOptionItem, IFormConfig, ISelectField, IMultiSelectField, IDatePickerField, ITimePickerField, IDateTimePickerField, ISubmitConfig } from './types';

export const generateId = (type?: string): string => {
  const typePrefixes: Record<string, string> = {
    text: 'input',
    option: 'option',
    select: 'select',
    multiSelect: 'multiSelect',
    datePicker: 'datePicker',
    timePicker: 'timePicker',
    dateTimePicker: 'dateTimePicker',
  };

  const prefix = type ? typePrefixes[type] : 'input';
  const randomChars = Math.random().toString(36).substr(2, 3);
  return `${prefix}_${randomChars}`;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const validateLetter = (value: string): boolean => {
  return /^[a-zA-Z]+$/.test(value);
};

export const validateAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

export const validateField = (field: IFormField, value: any): { isValid: boolean; error?: string } => {
  if (field.required && !value) {
    return { isValid: false, error: field.errorMessage || '此项为必填项' };
  }

  if (field.type === 'text') {
    const textField = field as ITextField;
    
    if (!value) {
      return { isValid: true };
    }

    if (textField.maxLength && value.length > textField.maxLength) {
      return { isValid: false, error: field.errorMessage || `最多输入 ${textField.maxLength} 个字符` };
    }

    switch (textField.inputType) {
      case 'email':
        if (!validateEmail(value)) {
          return { isValid: false, error: field.errorMessage || '请输入有效的邮箱地址' };
        }
        break;
      case 'phone':
        if (!validatePhone(value)) {
          return { isValid: false, error: field.errorMessage || '请输入有效的手机号' };
        }
        break;
      case 'url':
        if (!validateUrl(value)) {
          return { isValid: false, error: field.errorMessage || '请输入有效的URL' };
        }
        break;
      case 'number':
        if (!validateNumber(value)) {
          return { isValid: false, error: field.errorMessage || '请输入数字' };
        }
        break;
      case 'letter':
        if (!validateLetter(value)) {
          return { isValid: false, error: field.errorMessage || '请输入字母' };
        }
        break;
      case 'alphanumeric':
        if (!validateAlphanumeric(value)) {
          return { isValid: false, error: field.errorMessage || '请输入字母或数字' };
        }
        break;
    }
  }

  if (field.type === 'option') {
    const optionField = field as IOptionField;
    
    if (optionField.required && (!value || value.length === 0)) {
      return { isValid: false, error: field.errorMessage || '此项为必填项' };
    }

    if (optionField.optionType === 'checkbox' && value) {
      if (optionField.minSelect && value.length < optionField.minSelect) {
        return { isValid: false, error: field.errorMessage || `至少选择 ${optionField.minSelect} 项` };
      }
      if (optionField.maxSelect && value.length > optionField.maxSelect) {
        return { isValid: false, error: field.errorMessage || `最多选择 ${optionField.maxSelect} 项` };
      }
    }
  }

  if (field.type === 'select') {
    const selectField = field as ISelectField;
    
    if (selectField.required && !value) {
      return { isValid: false, error: field.errorMessage || '请选择选项' };
    }
  }

  if (field.type === 'multiSelect') {
    const multiSelectField = field as IMultiSelectField;
    
    if (multiSelectField.required && (!value || value.length === 0)) {
      return { isValid: false, error: field.errorMessage || '请至少选择一项' };
    }

    if (value) {
      if (multiSelectField.minSelect && value.length < multiSelectField.minSelect) {
        return { isValid: false, error: field.errorMessage || `至少选择 ${multiSelectField.minSelect} 项` };
      }
      if (multiSelectField.maxSelect && value.length > multiSelectField.maxSelect) {
        return { isValid: false, error: field.errorMessage || `最多选择 ${multiSelectField.maxSelect} 项` };
      }
    }
  }

  if (field.type === 'datePicker') {
    const datePickerField = field as IDatePickerField;
    
    if (datePickerField.required && !value) {
      return { isValid: false, error: field.errorMessage || '请选择日期' };
    }
  }

  if (field.type === 'timePicker') {
    const timePickerField = field as ITimePickerField;
    
    if (timePickerField.required && !value) {
      return { isValid: false, error: field.errorMessage || '请选择时间' };
    }
  }

  if (field.type === 'dateTimePicker') {
    const dateTimePickerField = field as IDateTimePickerField;
    
    if (dateTimePickerField.required && !value) {
      return { isValid: false, error: field.errorMessage || '请选择日期时间' };
    }
  }

  // collapseGroup 类型不在 IFormField 联合类型中，需确保类型定义已扩展
  if ((field as any).type === 'collapseGroup') {
    const collapseGroupField = field as any;
    
    if (collapseGroupField.required && (!value || value.length === 0)) {
      return { isValid: false, error: field.errorMessage || '请选择选项' };
    }

    if (collapseGroupField.maxSelect && collapseGroupField.maxSelect > 1 && value) {
      if (value.length > collapseGroupField.maxSelect) {
        return { isValid: false, error: field.errorMessage || `最多选择 ${collapseGroupField.maxSelect} 项` };
      }
    }
  }

  return { isValid: true };
};

export const getDefaultFormConfig = (): IFormConfig => {
  return {
    title: '',
    description: '',
    width: 'narrow',
    align: 'left',
    layoutMode: 'single',
    fieldSpacing: 4,
    showBorder: true,
    showShadow: true,
    backgroundColor: 'var(--bg-body)',
    borderRadius: 8,
    fields: [
      {
        id: generateId(),
        type: 'text',
        name: '文本输入',
        required: true,
        order: 0,
        labelSpacing: 8,
        placeholder: '请输入文本内容',
        inputType: 'none',
      },
      {
        id: generateId(),
        type: 'text',
        name: '文本输入',
        required: true,
        order: 1,
        labelSpacing: 8,
        placeholder: '请输入文本内容',
        inputType: 'none',
      },
    ] as any[],
    submitButton: {
      text: '提交',
      style: 'primary',
      size: 'medium',
      successMessage: '提交成功',
      afterSubmit: 'reset',
    },
    submitConfig: {
      enabled: true,
      method: 'POST',
      url: '',
      params: [],
      headers: [],
      successStatusRange: { min: 200, max: 299 },
    },
  };
};

export const buildRequestBody = (formData: Record<string, any>, fields: IFormField[]): Record<string, any> => {
  return fields.reduce((body, field) => {
    const value = formData[field.id];
    if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'option' && Array.isArray(value)) {
        body[field.id] = value;
      } else {
        body[field.id] = value;
      }
    }
    return body;
  }, {} as Record<string, any>);
};

export const buildHeaders = (headersConfig: Array<{ key: string; value: string }>): Record<string, string> => {
  return headersConfig.reduce((headers, header) => {
    if (header.key && header.value) {
      headers[header.key] = header.value;
    }
    return headers;
  }, {} as Record<string, string>);
};

export const buildUrlWithParams = (url: string, paramsConfig: Array<{ key: string; value: string }>, formData?: Record<string, any>): string => {
  try {
    const urlObj = new URL(url);
    
    paramsConfig.forEach(param => {
      if (param.key && param.value) {
        urlObj.searchParams.append(param.key, param.value);
      }
    });

    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          urlObj.searchParams.append(key, String(value));
        }
      });
    }

    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    return url;
  }
};

export const checkStatus = (status: number, range: { min: number; max: number }): boolean => {
  return status >= range.min && status <= range.max;
};

export const submitHttpRequest = async (
  submitConfig: ISubmitConfig,
  formData: Record<string, any>,
  fields: IFormField[]
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const headers = buildHeaders(submitConfig.headers);
    
    let url = submitConfig.url;
    let body: string | undefined;

    if (submitConfig.method === 'GET') {
      url = buildUrlWithParams(url, submitConfig.params, formData);
    } else {
      const requestBody = buildRequestBody(formData, fields);
      body = JSON.stringify(requestBody);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: submitConfig.method,
      headers,
      body,
    });

    const isSuccess = checkStatus(response.status, submitConfig.successStatusRange);

    if (isSuccess) {
      const responseData = await response.json().catch(() => null);
      return {
        success: true,
        message: '提交成功',
        data: responseData,
      };
    } else {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || `提交失败，状态码: ${response.status}`,
        data: errorData,
      };
    }
  } catch (error) {
    console.error('Submit error:', error);
    return {
      success: false,
      message: '提交失败，请检查网络连接',
    };
  }
};
