import { forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-neutral-200 active:bg-neutral-300',
  outline: 'bg-transparent border border-primary-500 active:bg-primary-50',
  ghost: 'bg-transparent active:bg-neutral-100',
};

const variantTextStyles = {
  primary: 'text-white',
  secondary: 'text-neutral-900',
  outline: 'text-primary-500',
  ghost: 'text-primary-500',
};

const sizeStyles = {
  sm: 'py-2 px-4',
  md: 'py-3 px-6',
  lg: 'py-4 px-8',
};

const sizeTextStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref as React.Ref<TouchableOpacity>}
        className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          rounded-xl items-center justify-center flex-row
          ${isDisabled ? 'opacity-50' : ''}
          ${className ?? ''}
        `}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.neutral[50] : colors.primary[500]}
            size="small"
          />
        ) : (
          <Text
            className={`
              ${variantTextStyles[variant]}
              ${sizeTextStyles[size]}
              font-semibold
            `}
          >
            {children}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
