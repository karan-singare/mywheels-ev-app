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
import { useAuth } from '../../hooks/use-auth.hook';
import { colors } from '../../config/theme.constant';
import type { AuthStackParamList } from '../../types/navigation.type';

type AdminLoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'AdminLogin'>;

export const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation<AdminLoginNavProp>();
  const { adminSignIn, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validate = (): boolean => {
    let valid = true;

    if (validateEmail(email)) {
      setEmailError('');
    } else {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (password.length >= 1) {
      setPasswordError('');
    } else {
      setPasswordError('Password is required');
      valid = false;
    }

    setRoleError('');
    return valid;
  };

  const handleAdminLogin = async () => {
    if (!validate()) return;

    const result = await adminSignIn(email, password);

    // Verify admin role after sign-in
    if (result.meta.requestStatus === 'fulfilled') {
      const payload = result.payload as { role?: string } | undefined;
      if (payload?.role !== 'admin') {
        setRoleError('This account does not have admin privileges');
      }
    }
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
            Admin Login
          </Text>
          <Text className="text-base text-[#6b7280] mb-8">
            Sign in with your admin credentials
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-[#141c6c] mb-1.5">
              Email
            </Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 h-12 bg-white ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <TextInput
                className="flex-1 text-base text-[#141c6c]"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholder="admin@mywheelsev.com"
                placeholderTextColor={colors.mutedLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                testID="email-input"
              />
            </View>
            {emailError ? (
              <Text className="text-xs text-red-500 mt-1">{emailError}</Text>
            ) : null}
          </View>

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

          {(error || roleError) ? (
            <View className="bg-red-50 rounded-xl p-3 mb-4">
              <Text className="text-sm text-red-600">{roleError || error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            className={`h-12 rounded-xl items-center justify-center mt-2 ${
              loading ? 'bg-[#141c6c]/70' : 'bg-[#141c6c]'
            }`}
            onPress={handleAdminLogin}
            disabled={loading}
            activeOpacity={0.8}
            testID="admin-login-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Admin Log In
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.navigate('Login')}
            testID="go-to-login"
          >
            <Text className="text-sm text-[#6b7280]">
              Not an admin?{' '}
              <Text className="text-[#184cba] font-semibold">Rider login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AdminLoginScreen;
