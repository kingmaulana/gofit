import Home from '@/screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useContext} from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import Training from '@/screens/Training';
import TrainingSession from '@/screens/TrainingSession';
import CategoryTraining from '@/screens/CategoryTraining';

import CustomCategory from '@/screens/CustomCategory';
import AddExercisePage from '@/screens/AddExercise';
import CreateCategoryPage from '@/screens/CreateCategory';

import {TouchableOpacity, View} from "react-native";
import {AuthContext} from "@/helpers/auth-context";
import ProgressGoal from '@/screens/ProgressGoal';
import HistoryExercise from '@/screens/HistoryExercise';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const {handleLogout} = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Daily') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Training') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Personal') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CustomCategory') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'AddExercisePage') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color}/>;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          width: '90%',
          marginHorizontal: '5%',
          elevation: 5,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 60,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }
      })
      }>
      <Tab.Screen name="History" component={HistoryExercise} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Daily" component={TrainingSession} />
      <Tab.Screen name="Training" component={Training} />
      <Tab.Screen name="Personal" component={CategoryTraining} />
      <Tab.Screen name="CustomCategory" component={CustomCategory} />
      <Tab.Screen name="AddExercisePage" component={AddExercisePage} />
      <Tab.Screen name="CreateCategoryPage" component={CreateCategoryPage} />

    </Tab.Navigator>
  )
}
