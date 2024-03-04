import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntriesList from './screens/EntriesList';
import EntryDetails from './screens/EntryDetails';
import EntryAddForm from './screens/EntryAddForm';

type EntriesStackParamList = {
  'entries-list': undefined;
  'view-entry': { id: number };
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

      {/* <Stack.Screen name='add-entry' component={EntriesListScreen} />
      <Stack.Screen name='edit-entry' component={EntriesListScreen} />
      <Stack.Screen name='delete-entry' component={EntriesListScreen} /> */}
    </Stack.Navigator>
  );
}

export default EntriesNavigator;
