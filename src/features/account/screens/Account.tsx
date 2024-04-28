import { User } from '@models';
import Button from '@shared/Button';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { getTokenFromStorage } from 'src/app/util';
import authSlice, { logOut } from 'src/features/auth/authSlice';

const Account: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  function handleLogout(): void {
    dispatch(logOut());
  }

  type AuthResponse = {
    user: User;
    token: string;
  };

  return (
    <View style={style.container}>
      <Text style={[style.header, { marginVertical: 10 }]}>Here is the profile screen</Text>
      <Button text="Logout" onPress={handleLogout} primary style={style.button} />
    </View>
  );
};

export default Account;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
});
