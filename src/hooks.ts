import { DashboardState, dashboard } from "@lark-base-open/js-sdk";
import React from "react";
import { useLayoutEffect, useState } from "react";
import { IFormField, IFormConfig, IValidationResult, FormHooks } from "./types";
import { validateField, getDefaultFormConfig, submitHttpRequest } from "./utils";

function updateTheme(theme: string) {
  document.body.setAttribute('theme-mode', theme);
}

export function useTheme() {
  const [bgColor, setBgColor] = useState('#ffffff');
  useLayoutEffect(() => {
    dashboard.getTheme().then((res) => {
      setBgColor(res.chartBgColor);
      updateTheme(res.theme.toLocaleLowerCase());
    })

    dashboard.onThemeChange((res) => {
      setBgColor(res.data.chartBgColor);
      updateTheme(res.data.theme.toLocaleLowerCase());
    })
  }, [])
  return {
    bgColor,
  }
}

export function useConfig(updateConfig: (data: any) => void) {

  const isCreate = dashboard.state === DashboardState.Create
  React.useEffect(() => {
    if (isCreate) {
      return
    }
    dashboard.getConfig().then(updateConfig);
  }, []);


  React.useEffect(() => {
    const offConfigChange = dashboard.onConfigChange((r) => {
      updateConfig(r.data);
    });
    return () => {
      offConfigChange();
    }
  }, []);
}

export function useFormConfig() {
  const [config, setConfig] = React.useState<IFormConfig>(getDefaultFormConfig());
  const [mode, setMode] = React.useState<DashboardState>(dashboard.state);

  React.useEffect(() => {
    if (mode === DashboardState.Create) {
      setConfig(getDefaultFormConfig());
    }
  }, [mode]);

  const updateConfig = (res: any) => {
    if (res.customConfig) {
      setConfig(res.customConfig as IFormConfig);
    }
  };

  useConfig(updateConfig);

  const saveConfig = () => {
    dashboard.saveConfig({
      customConfig: config,
      dataConditions: [],
    } as any);
  };

  return { config, setConfig, mode, saveConfig };
}

export function useFormValidation(fields: IFormField[]) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validateFieldById = (fieldId: string, value: any) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const result = validateField(field, value);
    
    setErrors(prev => ({
      ...prev,
      [fieldId]: result.error || ''
    }));

    return result.isValid;
  };

  const validateAll = (formData: Record<string, any>) => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const result = validateField(field, formData[field.id]);
      if (!result.isValid) {
        valid = false;
        newErrors[field.id] = result.error || '';
      }
    });

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return { errors, isValid, validateFieldById, validateAll, clearErrors };
}

export function useFormSubmit(config: IFormConfig) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitResult, setSubmitResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const [hooks, setHooks] = React.useState<FormHooks>({});

  const registerHooks = (newHooks: FormHooks) => {
    setHooks(newHooks);
  };

  const submitForm = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const errors: Array<{ fieldId: string; error: string }> = [];
      config.fields.forEach(field => {
        const result = validateField(field, formData[field.id]);
        if (!result.isValid) {
          errors.push({ fieldId: field.id, error: result.error || '' });
        }
      });

      if (errors.length > 0) {
        if (hooks.onError) {
          hooks.onError({ errors });
        }
        setIsSubmitting(false);
        return { success: false };
      }

      if (hooks.onValidate) {
        const shouldContinue = hooks.onValidate({ errors });
        if (!shouldContinue) {
          setIsSubmitting(false);
          return { success: false };
        }
      }

      if (hooks.onSubmit) {
        const shouldSubmit = hooks.onSubmit({ values: formData });
        if (!shouldSubmit) {
          setIsSubmitting(false);
          return { success: false };
        }
      }

      console.log('Form data submitted:', formData);

      const httpResult = await submitHttpRequest(config.submitConfig!, formData, config.fields);
      const submitSuccess = httpResult.success;
      const submitMessage = httpResult.message;

      setSubmitResult({ success: submitSuccess, message: submitMessage });

      return { success: submitSuccess };
    } catch (error) {
      console.error('Submit error:', error);
      const errors: Array<{ fieldId: string; error: string }> = [
        { fieldId: 'submit', error: '提交失败' },
      ];
      if (hooks.onError) {
        hooks.onError({ errors });
      }
      setSubmitResult({ success: false, message: '提交失败，请重试' });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitResult, submitForm, registerHooks };
}