import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EntriesListScreen from "../components/screens/entries/EntriesList";
import EntryDetailsScreen from "../components/screens/entries/EntryDetails";

type EntriesStackParamList = {
  "entries-list": undefined;
  "view-entry": { id: number };
  "add-entry": undefined;
  "edit-entry": { id: number };
  "delete-entry": undefined;
};

const Stack = createNativeStackNavigator<EntriesStackParamList>();

function EntriesStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='entries-list' component={EntriesListScreen} />
      <Stack.Screen name='view-entry' component={EntryDetailsScreen} />
      <Stack.Screen name='add-entry' component={EntriesListScreen} />
      <Stack.Screen name='edit-entry' component={EntriesListScreen} />
      <Stack.Screen name='delete-entry' component={EntriesListScreen} />
    </Stack.Navigator>
  );
}

export default EntriesStackNavigation;
