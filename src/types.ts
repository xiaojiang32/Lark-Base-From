export interface IFormField {
  id: string;
  type: 'text' | 'option' | 'select' | 'multiSelect' | 'datePicker' | 'timePicker' | 'dateTimePicker' | 'composite';
  name: string;
  required: boolean;
  order: number;
  errorMessage?: string;
  labelSpacing?: number;
  // 字段名称字体大小
  labelFontSize?: number;
  // 对齐方式
  align?: FormAlign;
  // 字段宽度
  width?: FormFieldWidth;
  // 是否启用父级关联
  enableParentLink?: boolean;
  // 父级选项字段ID（如果该字段是某个选项的子级字段）
  parentFieldId?: string;
  // 父级选项的值（当父级选项等于此值时显示）
  parentOptionValue?: string;
}

export interface ICompositeField extends IFormField {
  type: 'composite';
  children: string[];
  widthRatios: string;
  maxChildren: number;
}

export interface ITextField extends IFormField {
  type: 'text';
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  inputType?: 'none' | 'number' | 'letter' | 'alphanumeric' | 'email' | 'phone' | 'url';
  validationRules?: Array<'phone' | 'email' | 'url' | 'regex' | 'custom'>;
  customRegex?: string;
  errorMessage?: string;
}

export interface IOptionField extends IFormField {
  type: 'option';
  optionType: 'radio' | 'checkbox' | 'select' | 'tag';
  options: IOptionItem[];
  defaultValue?: string | string[];
  minSelect?: number;
  maxSelect?: number;
  allowCustom?: boolean;
  errorMessage?: string;
  direction?: 'horizontal' | 'vertical'; // 新增方向配置，支持横向和纵向布局
}

export interface ISelectField extends IFormField {
  type: 'select';
  placeholder?: string;
  options: IOptionItem[];
  defaultValue?: string;
  errorMessage?: string;
}

export interface IMultiSelectField extends IFormField {
  type: 'multiSelect';
  placeholder?: string;
  options: IOptionItem[];
  defaultValue?: string[];
  minSelect?: number;
  maxSelect?: number;
  errorMessage?: string;
}

export interface IDatePickerField extends IFormField {
  type: 'datePicker';
  placeholder?: string;
  defaultValue?: string;
  dateFormat?: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  minDate?: string;
  maxDate?: string;
  errorMessage?: string;
}

export interface ITimePickerField extends IFormField {
  type: 'timePicker';
  placeholder?: string;
  defaultValue?: string;
  timeFormat?: 'HH:mm' | 'HH:mm:ss';
  minTime?: string;
  maxTime?: string;
  timeInterval?: number;
  errorMessage?: string;
}

export interface IDateTimePickerField extends IFormField {
  type: 'dateTimePicker';
  placeholder?: string;
  defaultValue?: string;
  dateFormat?: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  timeFormat?: 'HH:mm' | 'HH:mm:ss';
  minDateTime?: string;
  maxDateTime?: string;
  timeInterval?: number;
  errorMessage?: string;
}



export interface IOptionItem {
  id: string;
  label: string;
  value?: string;
  defaultChecked?: boolean;
  order: number;
  icon?: string;
  // 关联的子级字段ID列表（当该选项被选中时，显示这些字段）
  linkedFields?: string[];
}

export interface ISubmitButton {
  text: string;
  style: 'primary' | 'secondary' | 'warning' | 'danger';
  size: 'small' | 'medium' | 'large';
  successMessage: string;
  afterSubmit: 'reset' | 'disable' | 'keep';
  align?: FormAlign;
  width?: FormFieldWidth;
}

export interface ISubmitConfig {
  enabled: boolean;
  method: 'GET' | 'POST';
  url: string;
  params: Array<{ key: string; value: string }>;
  headers: Array<{ key: string; value: string }>;
  successStatusRange: { min: number; max: number };
}

export type FormWidth = 'narrow' | 'standard' | 'wide' | 'full';
export type FormAlign = 'left' | 'center' | 'right';
export type FormFieldWidth = 'auto' | 'full';
export type FormLayoutMode = 'single' | 'double';

export interface IFormConfig {
  description?: string;
  width: FormWidth;
  fieldSpacing: number;
  showBorder: boolean;
  showShadow: boolean;
  borderRadius: number;
  padding: number;
  borderColor?: string;
  borderWidth?: number;
  stickyTop?: boolean; // 新增：是否吸顶
  fields: IFormField[];
  submitButton: ISubmitButton;
  submitConfig?: ISubmitConfig;
}

export interface IFormData {
  formId: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ISubmitResult {
  success: boolean;
  message: string;
}

export interface FormHooks {
  onMount?: (data: { form: IFormConfig }) => void | boolean;
  onChange?: (data: { id: string; value: any; form: IFormConfig }) => void | boolean;
  onValidate?: (data: { errors: Array<{ fieldId: string; error: string }> }) => boolean;
  onSubmit?: (data: { values: Record<string, any> }) => boolean;
  onError?: (data: { errors: Array<{ fieldId: string; error: string }> }) => void;
}

export interface IFieldConfig {
  id: string;
  type: string;
  name: string;
  required: boolean;
  order: number;
}

export type FieldType = 'text' | 'option' | 'select' | 'multiSelect' | 'datePicker' | 'timePicker' | 'dateTimePicker' | 'composite';

export interface ComponentLibraryItem {
  type: FieldType;
  name: string;
  icon: string;
  description: string;
  defaultConfig: any;
}
