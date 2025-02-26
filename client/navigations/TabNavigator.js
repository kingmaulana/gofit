
import Home from '@/screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import Training from '@/screens/Training';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={
      ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Daily') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Training') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Personal') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6034E0',
        tabBarInactiveTintColor: 'gray',
      })
    }>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Daily" component={Home} />
      <Tab.Screen name="Training" component={Training} />
      <Tab.Screen name="Personal" component={Home} />
    </Tab.Navigator>
  )
}
