import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { PhoneInput } from '../../components/forms/phone-input.component';
import { useAuth } from '../../hooks/use-auth.hook';
import { isValidIndianPhone } from '../../utils/validators.util';
import { colors } from '../../config/theme.constant';
import type { AuthStackParamList } from '../../types/navigation.type';

import { KeyboardAvoidingView } from '../../../components/ui/keyboard-avoiding-view';
import { ScrollView } from '../../../components/ui/scroll-view';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Button, ButtonText, ButtonSpinner } from '../../../components/ui/button';
import { Pressable } from '../../../components/ui/pressable';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from '../../../components/ui/form-control';
import { Input, InputField, InputSlot } from '../../../components/ui/input';
import { Alert, AlertText } from '../../../components/ui/alert';
import { HStack } from '../../../components/ui/hstack';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();
  const { signIn, loading, error } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;

    if (isValidIndianPhone(phone)) {
      setPhoneError('');
    } else {
      setPhoneError('Enter a valid 10-digit Indian phone number');
      valid = false;
    }

    if (password.length >= 1) {
      setPasswordError('');
    } else {
      setPasswordError('Password is required');
      valid = false;
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    signIn(phone, password);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8fafc]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <VStack className="flex-1 justify-center px-6 py-12" space="md">
          <Heading size="3xl" className="text-[#141c6c] mb-2">
            Welcome Back
          </Heading>
          <Text size="md" className="text-[#6b7280] mb-8">
            Log in to your MyWheels EV account
          </Text>

          <PhoneInput
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) setPhoneError('');
            }}
            error={phoneError}
          />

          <FormControl isInvalid={!!passwordError} className="mb-4">
            <FormControlLabel>
              <FormControlLabelText className="text-sm font-medium text-[#141c6c]">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="rounded-xl h-12 bg-white">
              <InputField
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedLight}
                secureTextEntry={!showPassword}
                autoComplete="password"
                testID="password-input"
              />
              <InputSlot
                onPress={() => setShowPassword(!showPassword)}
                className="pr-3"
                testID="toggle-password"
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.mutedLight} />
                ) : (
                  <Eye size={20} color={colors.mutedLight} />
                )}
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorText>{passwordError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {error ? (
            <Alert variant="destructive" className="rounded-xl mb-4">
              <AlertText>{error}</AlertText>
            </Alert>
          ) : null}

          <Button
            className="h-12 rounded-xl mt-2 bg-[#184cba]"
            onPress={handleLogin}
            disabled={loading}
            testID="login-button"
          >
            {loading ? (
              <ButtonSpinner color="#fff" />
            ) : (
              <ButtonText className="text-white text-base font-semibold">
                Log In
              </ButtonText>
            )}
          </Button>

          <Pressable
            className="mt-6 items-center"
            onPress={() => navigation.navigate('Signup')}
            testID="go-to-signup"
          >
            <HStack space="xs" className="items-center">
              <Text size="sm" className="text-[#6b7280]">
                Don't have an account?
              </Text>
              <Text size="sm" className="text-[#184cba] font-semibold">
                Sign up
              </Text>
            </HStack>
          </Pressable>

          <Pressable
            className="mt-3 items-center"
            onPress={() => navigation.navigate('AdminLogin')}
            testID="go-to-admin-login"
          >
            <HStack space="xs" className="items-center">
              <Text size="sm" className="text-[#6b7280]">
                Admin?
              </Text>
              <Text size="sm" className="text-[#184cba] font-semibold">
                Log in here
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
