import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-1"
            hitSlop={8}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.neutral[900]}
            />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-semibold text-neutral-900" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
