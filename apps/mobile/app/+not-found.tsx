import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white">
        <Text className="text-xl font-semibold text-neutral-900">
          {t('common.error')}
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-primary-500 text-base">
            {t('common.back')}
          </Text>
        </Link>
      </View>
    </>
  );
}
