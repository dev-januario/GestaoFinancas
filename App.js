import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import MainScreen from './screens/MainScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <PaperProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator>
                    <Stack.Screen
                        name="Main"
                        component={MainScreen}
                        options={{ title: 'Gestão de Finanças' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
