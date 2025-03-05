import Home from '@/screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import CategoryTraining from '@/screens/CategoryTraining';
import CustomCategory from '@/screens/CustomCategory';
import { AuthContext } from "@/helpers/auth-context";
import ProfileScreen from '@/screens/Profile';
import ProgressWeight from '@/screens/ProgressWeight';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { handleLogout } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'color-filter' : 'color-filter-outline';
          } else if (route.name === 'My Workout') {
            iconName = focused ? 'accessibility' : 'accessibility-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'CustomCategory') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
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
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }
      })
      }>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Category" component={CategoryTraining} />
      <Tab.Screen name="My Workout" component={CustomCategory} />
      <Tab.Screen name="Progress" component={ProgressWeight} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
