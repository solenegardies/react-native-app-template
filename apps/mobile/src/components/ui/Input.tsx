import { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      secureTextEntry,
      className,
      ...props
    },
    ref
  ) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    const toggleSecure = () => setIsSecure(!isSecure);

    return (
      <View className={className}>
        {label && (
          <Text className="text-sm font-medium text-neutral-700 mb-1.5">
            {label}
          </Text>
        )}

        <View
          className={`
            flex-row items-center
            bg-neutral-50 rounded-xl px-4
            border
            ${isFocused ? 'border-primary-500' : 'border-neutral-200'}
            ${error ? 'border-red-500' : ''}
          `}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={colors.neutral[400]}
              style={{ marginRight: 8 }}
            />
          )}

          <TextInput
            ref={ref}
            className="flex-1 py-3 text-base text-neutral-900"
            placeholderTextColor={colors.neutral[400]}
            secureTextEntry={isSecure}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {secureTextEntry && (
            <TouchableOpacity onPress={toggleSecure} hitSlop={8}>
              <Ionicons
                name={isSecure ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.neutral[400]}
              />
            </TouchableOpacity>
          )}

          {rightIcon && !secureTextEntry && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              hitSlop={8}
            >
              <Ionicons
                name={rightIcon}
                size={20}
                color={colors.neutral[400]}
              />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text className="text-sm text-red-500 mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
