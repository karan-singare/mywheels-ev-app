import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/navigation.type';

import { HeroSection } from '../../components/landing/hero-section.component';
import { TrustSection } from '../../components/landing/trust-section.component';
import { AboutSection } from '../../components/landing/about-section.component';
import { WhyElectricSection } from '../../components/landing/why-electric-section.component';
import { HowItWorksSection } from '../../components/landing/how-it-works-section.component';
import { EarningsComparisonSection } from '../../components/landing/earnings-comparison-section.component';
import { PricingSection } from '../../components/landing/pricing-section.component';
import { TestimonialsSection } from '../../components/landing/testimonials-section.component';
import { FAQSection } from '../../components/landing/faq-section.component';
import { ContactSection } from '../../components/landing/contact-section.component';
import { CTAStripSection } from '../../components/landing/cta-strip-section.component';
import { FloatingWhatsApp } from '../../components/shared/floating-whatsapp.component';

type LandingNavProp = NativeStackNavigationProp<AuthStackParamList, 'Landing'>;

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingNavProp>();

  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HeroSection onGetStarted={handleGetStarted} />
        <TrustSection />
        <AboutSection />
        <WhyElectricSection />
        <HowItWorksSection />
        <EarningsComparisonSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <CTAStripSection onGetStarted={handleGetStarted} />
      </ScrollView>
      <FloatingWhatsApp />
    </View>
  );
};

export default LandingScreen;
