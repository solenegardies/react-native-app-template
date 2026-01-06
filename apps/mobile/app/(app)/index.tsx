import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-neutral-900 mb-6">
          {t('home.welcome', { name: user?.email?.split('@')[0] ?? '' })}
        </Text>

        <Card className="mb-4">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">
            {t('home.title')}
          </Text>
          <Text className="text-neutral-600">
            Your app content goes here.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
