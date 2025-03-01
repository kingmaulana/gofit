import Home from '@/screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TrainingSession from '@/screens/TrainingSession';
import Training from '@/screens/Training';

const Stack = createNativeStackNavigator();

export default function RootStackHome() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="TrainingSession" component={TrainingSession} />
            <Stack.Screen name="Training" component={Training} />
        </Stack.Navigator>
    );
}