import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';
import { WHATSAPP_URL } from '../../constants/landing-data.constant';

const handlePress = () => {
  Linking.openURL(WHATSAPP_URL);
};

export const FloatingWhatsApp: React.FC = () => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel="Chat on WhatsApp"
      accessibilityRole="button"
      className="absolute bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-lg"
      style={{ elevation: 8 }}
    >
      <Text className="text-2xl">💬</Text>
    </TouchableOpacity>
  );
};

export default FloatingWhatsApp;
