import Home from '@/screens/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TrainingSession from '@/screens/TrainingSession';
import Training from '@/screens/Training';
import CustomCategory from '@/screens/CustomCategory';
import AddExercisePage from '@/screens/AddExercise';
import CreateCategoryPage from '@/screens/CreateCategory';
import ProfileScreen from '@/screens/Profile';
import ProgressWeight from '@/screens/ProgressWeight';
import WorkDetailByUser from '@/screens/WorkDetailByUser';
import EditExerciseCategory from '@/screens/EditExerciseCategory';
import TrainingByAI from '@/screens/TrainingByAI';
import ExerciseHistory from "@/screens/HistoryExercise";
import DetailsExercise from '@/screens/DetailsExercise';
import ProfileEdit from "@/screens/ProfileEdit";
import {FormProvider, useForm} from "react-hook-form";

const Stack = createNativeStackNavigator();

export default function RootStackHome() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* Main Screens */}
      <Stack.Screen name="Landing" component={TabNavigator}/>

      {/* Training Screens */}
      <Stack.Screen name="TrainingSession" component={TrainingSession}/>
      <Stack.Screen name="Training" component={Training}/>
      <Stack.Screen name="CustomCategory" component={CustomCategory}/>
      <Stack.Screen name="AddExercisePage" component={AddExercisePage}/>
      <Stack.Screen name="TrainingByAI" component={TrainingByAI}/>
      <Stack.Screen name="DetailsExercise" component={DetailsExercise}/>

      {/* Profile and Progress Screens */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
      <Stack.Screen name="EditProfile" component={ProfileEdit} options={{
        headerShown: true,
        title: 'Edit Profile',
      }} />
      <Stack.Screen name="HistoryExercise" component={ExerciseHistory}/>
      <Stack.Screen name="ProgressWeight" component={ProgressWeight}/>
      <Stack.Screen name="WorkDetailByUser" component={WorkDetailByUser}/>
      <Stack.Screen name="EditExerciseCategory" component={EditExerciseCategory}/>
    </Stack.Navigator>
  );
}