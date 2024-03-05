import Button from '@shared/Button';
import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { logout } from 'src/features/auth/authSlice';

const Account: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  function handleLogout(): void {
    dispatch(logout());
  }
  return (
    <View style={style.container}>
      <Text>Here is the profile screen</Text>
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
});
