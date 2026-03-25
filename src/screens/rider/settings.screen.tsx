import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogOut, Trash2, ChevronRight } from 'lucide-react-native';
import { ScrollView } from '@gluestackui/scroll-view';
import { VStack } from '@gluestackui/vstack';
import { HStack } from '@gluestackui/hstack';
import { Text } from '@gluestackui/text';
import { Heading } from '@gluestackui/heading';
import { Pressable } from '@gluestackui/pressable';
import { Button, ButtonText } from '@gluestackui/button';
import { Divider } from '@gluestackui/divider';
import { Avatar, AvatarFallbackText } from '@gluestackui/avatar';
import { useAuth } from '../../hooks/use-auth.hook';
import { useRider } from '../../hooks/use-rider.hook';
import { colors } from '../../config/theme.constant';
import type { RiderStackParamList } from '../../types/navigation.type';

type SettingsNav = NativeStackNavigationProp<RiderStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNav>();
  const { signOut } = useAuth();
  const { profile } = useRider();

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { signOut(); } },
    ]);
  }, [signOut]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion via Supabase
            Alert.alert('Coming Soon', 'Account deletion will be available soon.');
          },
        },
      ],
    );
  }, []);

  const displayName = profile?.full_name || 'Rider';

  return (
    <ScrollView
      className="flex-1 bg-[#f8fafc]"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <VStack className="px-6 py-6" space="lg">
        <Heading size="2xl" className="text-[#141c6c]">
          Settings
        </Heading>

        {/* Profile card */}
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <HStack
            className="bg-white rounded-xl p-4 items-center"
            space="md"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Avatar size="md" className="bg-[#184cba]">
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
            </Avatar>
            <VStack className="flex-1">
              <Text size="md" className="font-semibold text-[#141c6c]">
                {displayName}
              </Text>
              <Text size="sm" className="text-[#6b7280]">
                View and edit profile
              </Text>
            </VStack>
            <ChevronRight size={20} color={colors.mutedLight} />
          </HStack>
        </Pressable>

        <Divider className="my-2" />

        {/* Sign Out */}
        <Button
          variant="outline"
          className="h-12 rounded-xl border-[#184cba]"
          onPress={handleSignOut}
        >
          <HStack space="sm" className="items-center">
            <LogOut size={18} color={colors.primary} />
            <ButtonText className="text-[#184cba] font-semibold">
              Sign Out
            </ButtonText>
          </HStack>
        </Button>

        {/* Delete Account */}
        <Button
          variant="outline"
          className="h-12 rounded-xl border-red-500"
          onPress={handleDeleteAccount}
        >
          <HStack space="sm" className="items-center">
            <Trash2 size={18} color="#ef4444" />
            <ButtonText className="text-red-500 font-semibold">
              Delete Account
            </ButtonText>
          </HStack>
        </Button>
      </VStack>
    </ScrollView>
  );
}
