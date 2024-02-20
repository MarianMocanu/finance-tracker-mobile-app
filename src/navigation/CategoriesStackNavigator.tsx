import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EntriesListScreen from "../components/screens/entries/EntriesList";
import EntryDetailsScreen from "../components/screens/entries/EntryDetails";

type CategoriesStackParamList = {
  "categories-list": undefined;
  "view-category": { id: number };
  "add-category": undefined;
  "edit-category": { id: number };
  "delete-category": undefined;
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

function CategoriesStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='categories-list' component={EntriesListScreen} />
      <Stack.Screen name='view-category' component={EntryDetailsScreen} />
      <Stack.Screen name='add-category' component={EntriesListScreen} />
      <Stack.Screen name='edit-category' component={EntriesListScreen} />
      <Stack.Screen name='delete-category' component={EntriesListScreen} />
    </Stack.Navigator>
  );
}

export default CategoriesStackNavigation;
