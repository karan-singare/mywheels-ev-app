import '../global.css';
import { StatusBar, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { Card } from '../components/ui/card';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView className="flex-1 justify-center items-center p-4 bg-background">
          <Card size="lg" variant="outline">
            <Text className="text-xl font-bold text-foreground">MyWheels EV</Text>
            <Text className="text-muted-foreground">
              Gluestack UI v5 is working!
            </Text>
          </Card>
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

export default App;
