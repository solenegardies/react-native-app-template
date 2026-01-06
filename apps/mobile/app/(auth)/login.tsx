import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import { Button, Input, Header } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';
import { isValidEmail } from '@react-native-app/utils';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email || !isValidEmail(email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (!password || password.length < 8) {
      newErrors.password = t('auth.invalidPassword');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(t('common.error'), (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('auth.login')} showBack />
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 px-6 pt-8">
          <View className="gap-4">
            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />

            <Link href="/(auth)/forgot-password" className="self-end">
              <Text className="text-primary-500 text-sm">
                {t('auth.forgotPassword')}
              </Text>
            </Link>
          </View>

          <View className="mt-8">
            <Button
              variant="primary"
              onPress={handleLogin}
              loading={isLoading}
            >
              {t('auth.login')}
            </Button>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-500">
              {t('auth.noAccount')}{' '}
            </Text>
            <Link href="/(auth)/register">
              <Text className="text-primary-500 font-medium">
                {t('auth.register')}
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
