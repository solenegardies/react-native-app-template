import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-neutral-900 mb-2">
            {t('auth.welcome')}
          </Text>
          <Text className="text-lg text-neutral-500 text-center">
            {t('auth.welcomeSubtitle')}
          </Text>
        </View>

        <View className="gap-4">
          <Link href="/(auth)/login" asChild>
            <Button variant="primary">{t('auth.login')}</Button>
          </Link>

          <Link href="/(auth)/register" asChild>
            <Button variant="outline">{t('auth.register')}</Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
