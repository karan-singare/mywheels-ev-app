import React from 'react';
import { View, Text } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  EARNINGS_HEADER,
  EARNINGS_FUEL,
  EARNINGS_EV,
  type EarningsColumn,
} from '../../constants/landing-data.constant';

const ComparisonCard: React.FC<{ data: EarningsColumn }> = ({ data }) => {
  const borderColor = data.isPositive ? '#184cba' : '#ef4444';

  return (
    <View
      className="flex-1 bg-white rounded-2xl p-5 shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: borderColor }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-4">
        <Text className="text-2xl">{data.icon}</Text>
        <Text
          className="text-lg font-semibold"
          style={{ color: data.titleColor }}
        >
          {data.title}
        </Text>
      </View>

      {/* Rows */}
      {data.rows.map((row) => (
        <View
          key={row.label}
          className="flex-row justify-between py-3 border-b border-gray-100"
        >
          <Text className="text-sm text-[#374151]">{row.label}</Text>
          <Text className="text-sm font-semibold text-[#141c6c]">
            {row.value}
          </Text>
        </View>
      ))}

      {/* Message */}
      <Text
        className={`mt-4 text-sm font-medium ${
          data.isPositive ? 'text-[#184cba]' : 'text-[#ef4444]'
        }`}
      >
        {data.message}
      </Text>
    </View>
  );
};

export const EarningsComparisonSection: React.FC = () => {
  return (
    <SectionWrapper
      title={EARNINGS_HEADER.title}
      subtitle={EARNINGS_HEADER.label}
    >
      <View className="flex-col md:flex-row gap-4">
        <ComparisonCard data={EARNINGS_FUEL} />
        <ComparisonCard data={EARNINGS_EV} />
      </View>
    </SectionWrapper>
  );
};

export default EarningsComparisonSection;
