import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntriesNavigator from '../features/entries/EntriesStackNavigator';
import AccountNavigator from '../features/account/AccountStackNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';
import CategoriesNavigator from '../features/categories/CategoriesStackNavigator';

export type TabsParamList = {
  entries: {
    type: 'add' | 'edit' | 'view' | 'list';
    id: number;
  };
  categories: {
    type: 'add' | 'edit' | 'view' | 'list';
    id: number;
  };
  profile: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'entries':
              return <Ionicons name="checkmark-circle-outline" size={25} color={color} />;
            case 'profile':
              return <Ionicons name="person-circle-outline" size={25} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="entries" component={EntriesNavigator} />
      <Tab.Screen name="categories" component={CategoriesNavigator} />
      <Tab.Screen name="profile" component={AccountNavigator} />
    </Tab.Navigator>
  );
}
