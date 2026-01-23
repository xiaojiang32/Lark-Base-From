import React from 'react';
import { Input, Select, Button, InputNumber, Card, Typography } from '@douyinfe/semi-ui';
import { ISubmitConfig, IFormField } from '../../../types';

const { Text } = Typography;

interface SubmitConfigPanelProps {
  config?: any;
  setConfig: (config: any) => void;
  fields?: IFormField[];
}

function SubmitConfigPanel({ config, setConfig, fields }: SubmitConfigPanelProps) {
  const submitConfig = config?.submitConfig || {};

  const updateConfig = (updates: Partial<ISubmitConfig>) => {
    setConfig({
      ...config,
      submitConfig: {
        ...submitConfig,
        ...updates,
      },
    });
  };

  const addParam = () => {
    const newParams = [...(submitConfig?.params || []), { key: '', value: '' }];
    updateConfig({ params: newParams });
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...(submitConfig?.params || [])];
    newParams[index] = { ...newParams[index], [field]: value };
    updateConfig({ params: newParams });
  };

  const removeParam = (index: number) => {
    const newParams = (submitConfig?.params || []).filter((_, i) => i !== index);
    updateConfig({ params: newParams });
  };

  const addHeader = () => {
    const newHeaders = [...(submitConfig?.headers || []), { key: '', value: '' }];
    updateConfig({ headers: newHeaders });
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...(submitConfig?.headers || [])];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    updateConfig({ headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    const newHeaders = (submitConfig?.headers || []).filter((_, i) => i !== index);
    updateConfig({ headers: newHeaders });
  };

  return (
    <div className="submit-config-panel">
      <div className="config-section">
        <label>请求方法</label>
        <Select
          value={submitConfig?.method || 'POST'}
          onChange={(value) => updateConfig({ method: value as 'GET' | 'POST' })}
          optionList={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
          ]}
        />
      </div>

      <div className="config-section">
        <label>请求 URL</label>
        <Input
          value={submitConfig?.url || ''}
          onChange={(value) => updateConfig({ url: value })}
          placeholder="https://api.example.com/submit"
        />
      </div>

      <div className="config-section" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label>请求参数 (Params)</label>
          <Button
            type="tertiary"
            size="small"
            onClick={addParam}
          >
            添加参数
          </Button>
        </div>
        {(submitConfig?.params || []).map((param, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Input
              placeholder="参数名"
              value={param.key}
              onChange={(value) => updateParam(index, 'key', value)}
              style={{ flex: 1 }}
            />
            <Input
              placeholder="参数值"
              value={param.value}
              onChange={(value) => updateParam(index, 'value', value)}
              style={{ flex: 1 }}
            />
            <Button
              type="danger"
              size="small"
              onClick={() => removeParam(index)}
            >
              删除
            </Button>
          </div>
        ))}
      </div>

      <div className="config-section" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label>请求头 (Headers)</label>
          <Button
            type="tertiary"
            size="small"
            onClick={addHeader}
          >
            添加请求头
          </Button>
        </div>
        {(submitConfig?.headers || []).map((header, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Input
              placeholder="请求头名"
              value={header.key}
              onChange={(value) => updateHeader(index, 'key', value)}
              style={{ flex: 1 }}
            />
            <Input
              placeholder="请求头值"
              value={header.value}
              onChange={(value) => updateHeader(index, 'value', value)}
              style={{ flex: 1 }}
            />
            <Button
              type="danger"
              size="small"
              onClick={() => removeHeader(index)}
            >
              删除
            </Button>
          </div>
        ))}
      </div>

      <div className="config-group">
        <div className="config-section">
          <label>成功状态码最小值</label>
          <InputNumber
            value={submitConfig?.successStatusRange?.min || 200}
            onChange={(value) => updateConfig({
              successStatusRange: {
                ...submitConfig?.successStatusRange,
                min: value || 200,
              },
            })}
            min={100}
            max={599}
          />
        </div>

        <div className="config-section">
          <label>成功状态码最大值</label>
          <InputNumber
            value={submitConfig?.successStatusRange?.max || 299}
            onChange={(value) => updateConfig({
              successStatusRange: {
                ...submitConfig?.successStatusRange,
                max: value || 299,
              },
            })}
            min={100}
            max={599}
          />
        </div>
      </div>

      <div className="config-section" style={{ gridColumn: '1 / -1' }}>
        <label>请求体预览（JSON）</label>
        <Card
          style={{
            marginTop: 8,
            backgroundColor: 'var(--bg-body)',
            border: '1px solid var(--divider)',
            borderRadius: 4,
          }}
        >
          {fields && fields.length > 0 ? (
            <pre style={{
              margin: 0,
              padding: 16,
              fontSize: 13,
              fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
              backgroundColor: '#f5f5f5',
              color: '#24292e',
              overflow: 'auto',
              maxHeight: 200,
              borderRadius: 4,
              border: '1px solid #e0e0e',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}>
{JSON.stringify(
  fields.reduce((body, field) => {
    const fieldId = field.id;
    body[fieldId] = "";
    return body;
  }, {} as Record<string, string>),
  null,
  2
)}
            </pre>
          ) : (
            <div style={{
              padding: 12,
              textAlign: 'center',
              color: 'var(--ccm-chart-N600)',
            }}>
              <Text type="secondary">暂无组件，请先添加组件</Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default SubmitConfigPanel;
