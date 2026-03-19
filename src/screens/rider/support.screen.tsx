import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { CONTACT_INFO, FAQ_ITEMS } from '../../constants/landing-data.constant';
import { colors } from '../../config/theme.constant';

function ContactCard({
  label,
  value,
  icon,
  testID,
  onPress,
}: Readonly<{
  label: string;
  value: string;
  icon: string;
  testID: string;
  onPress: () => void;
}>) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: colors.mutedLight, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 15, color: colors.primary, fontWeight: '600' }}>{value}</Text>
      </View>
    </TouchableOpacity>
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
    <TouchableOpacity
      testID={`faq-item-${index}`}
      onPress={toggle}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textMain, flex: 1, marginRight: 8 }}>
          {question}
        </Text>
        <Text style={{ fontSize: 16, color: colors.mutedLight }}>{expanded ? '−' : '+'}</Text>
      </View>
      {expanded && (
        <Text testID={`faq-answer-${index}`} style={{ fontSize: 13, color: colors.muted, marginTop: 8, lineHeight: 20 }}>
          {answer}
        </Text>
      )}
    </TouchableOpacity>
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
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {/* Header */}
      <Text
        testID="support-header"
        style={{ fontSize: 24, fontWeight: '700', color: colors.textMain, marginBottom: 4 }}
      >
        Support
      </Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16 }}>
        We're here to help. Reach out anytime.
      </Text>

      {/* Contact cards */}
      <ContactCard
        label="Phone"
        value={CONTACT_INFO.phone}
        icon="📞"
        testID="contact-phone"
        onPress={handlePhone}
      />
      <ContactCard
        label="Email"
        value={CONTACT_INFO.email}
        icon="✉️"
        testID="contact-email"
        onPress={handleEmail}
      />
      <ContactCard
        label="WhatsApp"
        value="Chat with us"
        icon="💬"
        testID="contact-whatsapp"
        onPress={handleWhatsApp}
      />

      {/* FAQ section */}
      <Text
        testID="faq-header"
        style={{ fontSize: 18, fontWeight: '700', color: colors.textMain, marginTop: 16, marginBottom: 12 }}
      >
        Frequently Asked Questions
      </Text>
      {FAQ_ITEMS.map((item, index) => (
        <FAQItem key={item.q} question={item.q} answer={item.a} index={index} />
      ))}
    </ScrollView>
  );
}
