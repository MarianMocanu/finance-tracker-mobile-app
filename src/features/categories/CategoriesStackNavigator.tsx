import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesList from '../categories/screens/CategoriesList';
import CategoryDetails from '../categories/screens/CategoryDetails';

export type CategoriesStackParamList = {
  'categories-list': undefined;
  'view-category': { id: number };
  'add-category': undefined;
  'edit-category': { id: number };
  'delete-category': undefined;
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

function CategoriesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="categories-list" component={CategoriesList} />
      <Stack.Screen name="view-category" component={CategoryDetails} />
      {/* <Stack.Screen name='add-category' component={EntriesList} />
      <Stack.Screen name='edit-category' component={EntriesList} />
      <Stack.Screen name='delete-category' component={EntriesList} /> */}
    </Stack.Navigator>
  );
}

export default CategoriesNavigator;
