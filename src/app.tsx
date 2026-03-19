import '../global.css';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { NavigationContainer } from './navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

export default App;
