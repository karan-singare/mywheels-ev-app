import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  CONTACT_HEADER,
  CONTACT_CARDS,
  WHATSAPP_URL,
} from '../../constants/landing-data.constant';

export const ContactSection: React.FC = () => {
  const handleCardPress = (label: string, value: string) => {
    if (label === 'Phone') {
      Linking.openURL(`tel:${value.replaceAll(' ', '')}`);
    } else if (label === 'Email') {
      Linking.openURL(`mailto:${value}`);
    }
  };

  const handleWhatsApp = () => {
    Linking.openURL(WHATSAPP_URL);
  };

  return (
    <SectionWrapper
      title={CONTACT_HEADER.title}
      subtitle={CONTACT_HEADER.subtitle}
    >
      {/* Contact cards */}
      <View className="gap-4 mb-8">
        {CONTACT_CARDS.map((card) => {
          const isInteractive = card.label === 'Phone' || card.label === 'Email';

          return (
            <TouchableOpacity
              key={card.label}
              onPress={() => handleCardPress(card.label, card.value)}
              disabled={!isInteractive}
              className="bg-white rounded-2xl p-5 flex-row items-center gap-4 shadow-sm"
              accessibilityRole={isInteractive ? 'button' : 'text'}
              accessibilityLabel={`${card.label}: ${card.value}`}
            >
              <View className="w-12 h-12 rounded-xl bg-[#184cba]/10 items-center justify-center">
                <Text className="text-2xl">{card.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-[#6b7280] font-medium uppercase tracking-wider mb-1">
                  {card.label}
                </Text>
                <Text className="text-sm text-[#141c6c] font-semibold">
                  {card.value}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* WhatsApp CTA */}
      <TouchableOpacity
        onPress={handleWhatsApp}
        className="bg-[#25D366] py-4 rounded-xl items-center"
        accessibilityRole="button"
        accessibilityLabel="Chat on WhatsApp"
      >
        <Text className="text-white font-semibold text-sm">
          💬 Chat on WhatsApp
        </Text>
      </TouchableOpacity>
    </SectionWrapper>
  );
};

export default ContactSection;
