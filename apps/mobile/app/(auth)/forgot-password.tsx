import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import { Button, Input, Header } from '@/components/ui';
import { supabase } from '@/services/auth/supabase';
import { isValidEmail } from '@react-native-app/utils';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email || !isValidEmail(email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    setError(undefined);
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setSent(true);
      Alert.alert(t('auth.resetPassword'), t('auth.resetEmailSent'));
    } catch (err) {
      Alert.alert(t('common.error'), (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('auth.forgotPassword')} showBack />
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 px-6 pt-8">
          {sent ? (
            <View className="items-center py-8">
              <Text className="text-lg text-neutral-700 text-center">
                {t('auth.resetEmailSent')}
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-neutral-600 mb-6">
                {t('auth.welcomeSubtitle')}
              </Text>

              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={error}
              />

              <View className="mt-8">
                <Button
                  variant="primary"
                  onPress={handleReset}
                  loading={isLoading}
                >
                  {t('auth.sendResetLink')}
                </Button>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
