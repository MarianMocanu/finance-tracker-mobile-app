import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesList from '../categories/screens/CategoriesList';
import CategoryDetails from '../categories/screens/CategoryDetails';

type CategoriesStackParamList = {
  Categories: undefined;
  'Back to all categories': { id: number };
  'add-category': undefined;
  'edit-category': { id: number };
  'delete-category': undefined;
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

function CategoriesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={CategoriesList} />
      <Stack.Screen name="Back to all categories" component={CategoryDetails} />
      {/* <Stack.Screen name='add-category' component={CategoryDetails} />
      <Stack.Screen name='edit-category' component={CategoryDetails} />
      <Stack.Screen name='delete-category' component={CategoryDetails} /> */}
    </Stack.Navigator>
  );
}

export default CategoriesNavigator;
