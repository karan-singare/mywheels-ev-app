/**
 * Deep link utility functions for opening external GPS tracking
 * and Bluetooth battery monitoring apps.
 *
 * Uses React Native's Linking API.
 */

import { Alert, Linking } from 'react-native';

/** Scheme for the external GPS tracking app. */
const GPS_APP_SCHEME = 'mywheels-gps';
/** Store URL fallback when the GPS app is not installed. */
const GPS_APP_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mywheels.gps';

/** Scheme for the external Bluetooth battery monitoring app. */
const BATTERY_APP_SCHEME = 'mywheels-battery';
/** Store URL fallback when the battery app is not installed. */
const BATTERY_APP_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mywheels.battery';

/**
 * Opens the external GPS tracking app with the given vehicle pre-selected.
 * Falls back to an install prompt if the app is not installed.
 */
export async function openGPSTracker(vehicleId: string): Promise<void> {
  const url = `${GPS_APP_SCHEME}://track?vehicleId=${encodeURIComponent(vehicleId)}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      'GPS App Not Installed',
      'The GPS tracking app is not installed on your device. Would you like to install it?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Install',
          onPress: () => {
            void Linking.openURL(GPS_APP_STORE_URL);
          },
        },
      ],
    );
  }
}

/**
 * Opens the external Bluetooth battery monitoring app for the given vehicle.
 * Falls back to an install prompt if the app is not installed.
 */
export async function openBatteryMonitor(vehicleId: string): Promise<void> {
  const url = `${BATTERY_APP_SCHEME}://monitor?vehicleId=${encodeURIComponent(vehicleId)}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      'Battery App Not Installed',
      'The battery monitoring app is not installed on your device. Would you like to install it?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Install',
          onPress: () => {
            void Linking.openURL(BATTERY_APP_STORE_URL);
          },
        },
      ],
    );
  }
}
