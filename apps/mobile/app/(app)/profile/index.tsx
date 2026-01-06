import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { Button, Card } from '@/components/ui';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert(t('common.error'), (error as Error).message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-neutral-900 mb-6">
          {t('profile.title')}
        </Text>

        <Card className="mb-6">
          <View className="items-center py-4">
            <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center mb-4">
              <Text className="text-3xl text-primary-600">
                {user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-neutral-900">
              {user?.email}
            </Text>
          </View>
        </Card>

        <Card className="mb-6">
          <View className="py-2">
            <View className="flex-row justify-between py-3 border-b border-neutral-100">
              <Text className="text-neutral-500">{t('auth.email')}</Text>
              <Text className="text-neutral-900">{user?.email}</Text>
            </View>
          </View>
        </Card>

        <Button variant="outline" onPress={handleLogout}>
          {t('auth.logout')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
