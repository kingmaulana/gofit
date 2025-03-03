import Home from '@/screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TrainingSession from '@/screens/TrainingSession';
import Training from '@/screens/Training';
import CustomCategory from '@/screens/CustomCategory';
import AddExercisePage from '@/screens/AddExercise';
import CreateCategoryPage from '@/screens/CreateCategory';
import ProfileScreen from '@/screens/Profile';
import ProgressWeight from '@/screens/ProgressWeight';

const Stack = createNativeStackNavigator();

export default function RootStackHome() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="TrainingSession" component={TrainingSession} />
            <Stack.Screen name="Training" component={Training} />
            <Stack.Screen name="CustomCategory" component={CustomCategory} />
            <Stack.Screen name="AddExercisePage" component={AddExercisePage} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProgressWeight" component={ProgressWeight} />
        </Stack.Navigator>
    );
}