import '../../global.css';
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '../../components/ui/gluestack-ui-provider';
import { store } from '../store';
import { RootNavigator } from '../navigation';

export default function App() {
  return (
    <Provider store={store}>
      <GluestackUIProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GluestackUIProvider>
    </Provider>
  );
}
