import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { ISubmitButton } from '../../../../types';

interface SubmitButtonProps {
  config: ISubmitButton;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function SubmitButton({ config, onClick, disabled, loading }: SubmitButtonProps) {
  const getTheme = () => {
    switch (config.style) {
      case 'primary':
        return 'solid';
      case 'secondary':
        return 'tertiary';
      case 'warning':
        return 'solid';
      case 'danger':
        return 'solid';
      default:
        return 'solid';
    }
  };

  const getType = () => {
    switch (config.style) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'tertiary';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getSize = () => {
    switch (config.size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'default';
      case 'large':
        return 'large';
      default:
        return 'default';
    }
  };

  // 根据配置决定是否使用block属性
  const isBlock = config.width === 'full';

  return (
    <div 
      className="submit-button-container"
      style={{
        display: 'flex',
        justifyContent: config.align || 'left',
        width: '100%'
      }}
    >
      <Button
        theme={getTheme() as any}
        type={getType() as any}
        size={getSize() as any}
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        block={isBlock}
        style={{
          width: isBlock ? '100%' : 'auto'
        }}
      >
        {config.text}
      </Button>
    </div>
  );
}
