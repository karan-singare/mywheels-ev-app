import '../../global.css';
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestackui/gluestack-ui-provider';
import { store } from '../store';
import { RootNavigator } from '../navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GluestackUIProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaView>
        </GluestackUIProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
