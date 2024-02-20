import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../components/screens/Profile";

type ProfileStackParamList = {
  "view-profile": undefined;
  "edit-profile": undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='view-profile' component={ProfileScreen} />
      <Stack.Screen name='edit-profile' component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigation;
