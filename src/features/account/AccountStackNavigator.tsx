import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './screens/Account';
import { getTokenFromStorage } from 'src/app/util';
import axios from '@services/axios';
import { AuthResponse } from '../auth/authSlice';
import AdminAccount from './screens/AdminAccount';

type ProfileStackParamList = {
  'view-profile': undefined;
  'edit-profile': undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();
// const [isAdmin, setIsAdmin] = useState(false);

function AccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="view-profile" component={Account} />
      <Stack.Screen name="edit-profile" component={Account} />
    </Stack.Navigator>
  );
}

export default AccountNavigator;
