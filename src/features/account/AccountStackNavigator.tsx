import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Account from "./screens/Account";

type ProfileStackParamList = {
  "view-profile": undefined;
  "edit-profile": undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

function AccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="view-profile" component={Account} />
      <Stack.Screen name="edit-profile" component={Account} />
    </Stack.Navigator>
  );
}

export default AccountNavigator;
