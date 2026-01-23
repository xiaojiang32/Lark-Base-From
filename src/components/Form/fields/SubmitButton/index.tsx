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

  return (
    <div className="submit-button-container">
      <Button
        theme={getTheme() as any}
        type={getType() as any}
        size={getSize() as any}
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        block
      >
        {config.text}
      </Button>
    </div>
  );
}
