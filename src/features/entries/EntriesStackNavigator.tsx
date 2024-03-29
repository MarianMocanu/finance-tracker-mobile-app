import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntriesList from './screens/EntriesList';
import EntryDetails from './screens/EntryDetails';
import EntryAddForm from './screens/EntryAddForm';
import EntryEditForm from './screens/EntryEditForm';

export type EntriesStackParamList = {
  'entries-list': undefined;
  'view-entry': { id: number; from: 'entries-list' | 'view-category' };
  'add-entry': undefined;
  'edit-entry': { id: number };
  'delete-entry': undefined;
};

const Stack = createNativeStackNavigator<EntriesStackParamList>();

function EntriesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="entries-list" component={EntriesList} />
      <Stack.Screen name="view-entry" component={EntryDetails} />
      <Stack.Screen name="add-entry" component={EntryAddForm} />
      <Stack.Screen name="edit-entry" component={EntryEditForm} />
    </Stack.Navigator>
  );
}

export default EntriesNavigator;
