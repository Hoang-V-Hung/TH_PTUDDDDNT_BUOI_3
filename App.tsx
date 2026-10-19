import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from './src/contexts/StudyContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { studyColors } from './src/theme/studyTheme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: studyColors.primary,
    background: studyColors.background,
    card: studyColors.surface,
    text: studyColors.text,
    border: studyColors.border,
  },
};

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StudyProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </StudyProvider>
    </SafeAreaProvider>
  );
}
