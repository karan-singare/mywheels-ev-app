import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { PhoneInput } from '../../components/forms/phone-input.component';
import { useAuth } from '../../hooks/use-auth.hook';
import { isValidIndianPhone } from '../../utils/validators.util';
import { colors } from '../../config/theme.constant';
import type { AuthStackParamList } from '../../types/navigation.type';

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
        <View className="flex-1 justify-center px-6 py-12">
          <Text className="text-3xl font-bold text-[#141c6c] mb-2">
            Welcome Back
          </Text>
          <Text className="text-base text-[#6b7280] mb-8">
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

          <View className="mb-4">
            <Text className="text-sm font-medium text-[#141c6c] mb-1.5">
              Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 h-12 bg-white ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <TextInput
                className="flex-1 text-base text-[#141c6c]"
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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="toggle-password"
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.mutedLight} />
                ) : (
                  <Eye size={20} color={colors.mutedLight} />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text className="text-xs text-red-500 mt-1">{passwordError}</Text>
            ) : null}
          </View>

          {error ? (
            <View className="bg-red-50 rounded-xl p-3 mb-4">
              <Text className="text-sm text-red-600">{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            className={`h-12 rounded-xl items-center justify-center mt-2 ${
              loading ? 'bg-[#184cba]/70' : 'bg-[#184cba]'
            }`}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            testID="login-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.navigate('Signup')}
            testID="go-to-signup"
          >
            <Text className="text-sm text-[#6b7280]">
              Don't have an account?{' '}
              <Text className="text-[#184cba] font-semibold">Sign up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-3 items-center"
            onPress={() => navigation.navigate('AdminLogin')}
            testID="go-to-admin-login"
          >
            <Text className="text-sm text-[#6b7280]">
              Admin?{' '}
              <Text className="text-[#184cba] font-semibold">Log in here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
