import React, { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import { Phone, Mail, MessageCircle } from 'lucide-react-native';
import { ScrollView } from '@gluestackui/scroll-view';
import { VStack } from '@gluestackui/vstack';
import { HStack } from '@gluestackui/hstack';
import { Box } from '@gluestackui/box';
import { Text } from '@gluestackui/text';
import { Heading } from '@gluestackui/heading';
import { Pressable } from '@gluestackui/pressable';
import { CONTACT_INFO, FAQ_ITEMS } from '../../constants/landing-data.constant';
import { colors } from '../../config/theme.constant';

function ContactCard({
  label,
  value,
  icon: Icon,
  testID,
  onPress,
}: Readonly<{
  label: string;
  value: string;
  icon: React.ElementType;
  testID: string;
  onPress: () => void;
}>) {
  return (
    <Pressable testID={testID} onPress={onPress}>
      <HStack
        className="bg-white rounded-xl p-4 mb-3 items-center"
        space="md"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <Box className="w-10 h-10 rounded-full bg-[#e8eef8] items-center justify-center">
          <Icon size={20} color={colors.primary} />
        </Box>
        <VStack className="flex-1">
          <Text size="xs" className="text-[#6b7280] mb-0.5">{label}</Text>
          <Text size="md" className="text-[#184cba] font-semibold">{value}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}

function FAQItem({
  question,
  answer,
  index,
}: Readonly<{ question: string; answer: string; index: number }>) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <Pressable testID={`faq-item-${index}`} onPress={toggle}>
      <Box
        className="bg-white rounded-xl p-4 mb-2"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}
      >
        <HStack className="justify-between items-center">
          <Text size="sm" className="font-semibold text-[#141c6c] flex-1 mr-2">
            {question}
          </Text>
          <Text size="md" className="text-[#6b7280]">{expanded ? '−' : '+'}</Text>
        </HStack>
        {expanded && (
          <Text
            testID={`faq-answer-${index}`}
            size="sm"
            className="text-[#374151] mt-2 leading-5"
          >
            {answer}
          </Text>
        )}
      </Box>
    </Pressable>
  );
}

export function SupportScreen() {
  const handlePhone = useCallback(() => {
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  }, []);

  const handleEmail = useCallback(() => {
    Linking.openURL(`mailto:${CONTACT_INFO.email}`);
  }, []);

  const handleWhatsApp = useCallback(() => {
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsappNumber}`);
  }, []);

  return (
    <ScrollView
      testID="support-screen"
      className="flex-1 bg-[#f8fafc]"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Heading size="2xl" className="text-[#141c6c] mb-1">
        Support
      </Heading>
      <Text size="sm" className="text-[#374151] mb-4">
        We're here to help. Reach out anytime.
      </Text>

      <ContactCard
        label="Phone"
        value={CONTACT_INFO.phone}
        icon={Phone}
        testID="contact-phone"
        onPress={handlePhone}
      />
      <ContactCard
        label="Email"
        value={CONTACT_INFO.email}
        icon={Mail}
        testID="contact-email"
        onPress={handleEmail}
      />
      <ContactCard
        label="WhatsApp"
        value="Chat with us"
        icon={MessageCircle}
        testID="contact-whatsapp"
        onPress={handleWhatsApp}
      />

      <Heading size="lg" className="text-[#141c6c] mt-4 mb-3">
        Frequently Asked Questions
      </Heading>
      {FAQ_ITEMS.map((item, index) => (
        <FAQItem key={item.q} question={item.q} answer={item.a} index={index} />
      ))}
    </ScrollView>
  );
}
