
import Home from '@/screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Home} />
    </Tab.Navigator>
  )
}
