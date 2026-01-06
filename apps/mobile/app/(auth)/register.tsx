import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import { Button, Input, Header } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';
import { isValidEmail } from '@react-native-app/utils';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { register } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email || !isValidEmail(email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (!password || password.length < 8) {
      newErrors.password = t('auth.invalidPassword');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(email, password);
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(t('common.error'), (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('auth.register')} showBack />
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
              autoComplete="new-password"
              error={errors.password}
            />

            <Input
              label={t('auth.confirmPassword')}
              placeholder={t('auth.passwordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
          </View>

          <View className="mt-8">
            <Button
              variant="primary"
              onPress={handleRegister}
              loading={isLoading}
            >
              {t('auth.register')}
            </Button>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-500">
              {t('auth.haveAccount')}{' '}
            </Text>
            <Link href="/(auth)/login">
              <Text className="text-primary-500 font-medium">
                {t('auth.login')}
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
