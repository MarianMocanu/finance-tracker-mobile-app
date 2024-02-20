import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EntriesStackNavigation from "./EntriesStackNavigator";
import ProfileStackNavigation from "./ProfileStackNavigator";
import Ionicons from "@expo/vector-icons/Ionicons";
import CategoriesStackNavigation from "./CategoriesStackNavigator";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case "entries":
                return <Ionicons name='checkmark-circle-outline' size={25} color={color} />;
              case "profile":
                return <Ionicons name='person-circle-outline' size={25} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name='entries' component={EntriesStackNavigation} />
        <Tab.Screen name='categories' component={CategoriesStackNavigation} />
        <Tab.Screen name='profile' component={ProfileStackNavigation} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
