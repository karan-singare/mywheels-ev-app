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
  Alert,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../../hooks/use-auth.hook';
import { useRider } from '../../hooks/use-rider.hook';
import { useAppDispatch } from '../../store';
import { createProfile } from '../../store/thunks/rider.thunk';
import { isNonEmpty, isMinAge, isValidIndianPhone } from '../../utils/validators.util';
import { colors } from '../../config/theme.constant';
import type { Gender } from '../../enums/gender.enum';
import type { RiderProfileInput } from '../../types/rider.type';

const TOTAL_STEPS = 3;

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender | '';
  address: string;
  city: string;
  emergencyContact: string;
}

interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  emergencyContact?: string;
}

export const OnboardingScreen: React.FC = () => {
  const { user } = useAuth();
  const { loading } = useRider();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: 'Hyderabad',
    emergencyContact: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const stepErrors: FormErrors = {};
    if (!isNonEmpty(formData.fullName)) {
      stepErrors.fullName = 'Full name is required';
    }
    if (!isNonEmpty(formData.dateOfBirth)) {
      stepErrors.dateOfBirth = 'Date of birth is required';
    } else if (!isMinAge(formData.dateOfBirth, 18)) {
      stepErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (!formData.gender) {
      stepErrors.gender = 'Please select a gender';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: FormErrors = {};
    if (!isNonEmpty(formData.address)) {
      stepErrors.address = 'Address is required';
    }
    if (!isNonEmpty(formData.city)) {
      stepErrors.city = 'City is required';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const stepErrors: FormErrors = {};
    if (!isValidIndianPhone(formData.emergencyContact)) {
      stepErrors.emergencyContact = 'Enter a valid 10-digit Indian phone number';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    else if (step === 2) valid = validateStep2();
    if (valid && step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setErrors({});
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    const userId = user?.id;
    if (!userId) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      return;
    }
    const profileData: RiderProfileInput = {
      full_name: formData.fullName.trim(),
      phone: user?.phone ?? '',
      date_of_birth: formData.dateOfBirth.trim(),
      gender: formData.gender as Gender,
      address: formData.address.trim(),
      city: formData.city.trim(),
      emergency_contact: formData.emergencyContact.trim(),
    };
    dispatch(createProfile({ userId, data: profileData }));
  };

  const getStepBgColor = (isActive: boolean, isCompleted: boolean): string => {
    if (isActive) return 'bg-[#184cba]';
    if (isCompleted) return 'bg-[#84d06e]';
    return 'bg-gray-300';
  };

  const renderProgressIndicator = () => (
    <View className="flex-row items-center justify-center mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isCompleted = stepNum < step;
        return (
          <React.Fragment key={stepNum}>
            {i > 0 && (
              <View
                className={`h-0.5 w-8 mx-1 ${
                  isCompleted ? 'bg-[#84d06e]' : 'bg-gray-300'
                }`}
              />
            )}
            <View
              className={`h-8 w-8 rounded-full items-center justify-center ${
                getStepBgColor(isActive, isCompleted)
              }`}
            >
              <Text className="text-white text-sm font-semibold">{stepNum}</Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text className="text-xl font-bold text-[#141c6c] mb-1">Personal Information</Text>
      <Text className="text-sm text-[#6b7280] mb-6">Tell us about yourself</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">Full Name</Text>
        <View
          className={`rounded-xl border px-3 h-12 bg-white justify-center ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <TextInput
            className="text-base text-[#141c6c]"
            value={formData.fullName}
            onChangeText={(t) => updateField('fullName', t)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.mutedLight}
            autoComplete="name"
            testID="fullname-input"
          />
        </View>
        {errors.fullName ? (
          <Text className="text-xs text-red-500 mt-1">{errors.fullName}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">Date of Birth</Text>
        <View
          className={`rounded-xl border px-3 h-12 bg-white justify-center ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <TextInput
            className="text-base text-[#141c6c]"
            value={formData.dateOfBirth}
            onChangeText={(t) => updateField('dateOfBirth', t)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedLight}
            testID="dob-input"
          />
        </View>
        {errors.dateOfBirth ? (
          <Text className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">Gender</Text>
        <View className="flex-row gap-3">
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 h-12 rounded-xl border items-center justify-center ${
                formData.gender === option.value
                  ? 'border-[#184cba] bg-[#184cba]/10'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => updateField('gender', option.value)}
              testID={`gender-${option.value}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: formData.gender === option.value }}
            >
              <Text
                className={`text-sm font-medium ${
                  formData.gender === option.value
                    ? 'text-[#184cba]'
                    : 'text-[#374151]'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? (
          <Text className="text-xs text-red-500 mt-1">{errors.gender}</Text>
        ) : null}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="text-xl font-bold text-[#141c6c] mb-1">Address Details</Text>
      <Text className="text-sm text-[#6b7280] mb-6">Where are you located?</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">Address</Text>
        <View
          className={`rounded-xl border px-3 py-2 bg-white ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <TextInput
            className="text-base text-[#141c6c]"
            value={formData.address}
            onChangeText={(t) => updateField('address', t)}
            placeholder="Enter your full address"
            placeholderTextColor={colors.mutedLight}
            multiline
            numberOfLines={3}
            style={{ minHeight: 72, textAlignVertical: 'top' }}
            testID="address-input"
          />
        </View>
        {errors.address ? (
          <Text className="text-xs text-red-500 mt-1">{errors.address}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">City</Text>
        <View
          className={`rounded-xl border px-3 h-12 bg-white justify-center ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <TextInput
            className="text-base text-[#141c6c]"
            value={formData.city}
            onChangeText={(t) => updateField('city', t)}
            placeholder="Enter your city"
            placeholderTextColor={colors.mutedLight}
            testID="city-input"
          />
        </View>
        {errors.city ? (
          <Text className="text-xs text-red-500 mt-1">{errors.city}</Text>
        ) : null}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text className="text-xl font-bold text-[#141c6c] mb-1">Emergency Contact</Text>
      <Text className="text-sm text-[#6b7280] mb-6">
        Someone we can reach in case of emergency
      </Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-[#141c6c] mb-1.5">
          Emergency Contact Number
        </Text>
        <View
          className={`flex-row items-center rounded-xl border px-3 h-12 bg-white ${
            errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <View className="mr-2 pr-2 border-r border-gray-300">
            <Text className="text-base text-[#374151] font-medium">+91</Text>
          </View>
          <TextInput
            className="flex-1 text-base text-[#141c6c]"
            value={formData.emergencyContact}
            onChangeText={(t) => {
              const numeric = t.replaceAll(/\D/g, '');
              if (numeric.length <= 10) {
                updateField('emergencyContact', numeric);
              }
            }}
            placeholder="Enter 10-digit number"
            placeholderTextColor={colors.mutedLight}
            keyboardType="number-pad"
            maxLength={10}
            testID="emergency-contact-input"
          />
        </View>
        {errors.emergencyContact ? (
          <Text className="text-xs text-red-500 mt-1">{errors.emergencyContact}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8fafc]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            {step > 1 ? (
              <TouchableOpacity
                onPress={handleBack}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                testID="back-button"
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <ChevronLeft size={24} color={colors.textMain} />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24 }} />
            )}
            <Text
              className="flex-1 text-center text-sm font-medium text-[#6b7280]"
              testID="step-indicator"
            >
              Step {step} of {TOTAL_STEPS}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {renderProgressIndicator()}

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Action button */}
          <View className="mt-auto pt-6">
            <TouchableOpacity
              className={`h-12 rounded-xl items-center justify-center ${
                loading ? 'bg-[#184cba]/70' : 'bg-[#184cba]'
              }`}
              onPress={step < TOTAL_STEPS ? handleNext : handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
              testID={step < TOTAL_STEPS ? 'next-button' : 'submit-button'}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {step < TOTAL_STEPS ? 'Continue' : 'Complete Profile'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;
