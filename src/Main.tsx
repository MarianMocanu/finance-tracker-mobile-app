import { StatusBar } from 'expo-status-bar';
import { FC, useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import TabNavigator from './navigation/TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './app/store';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './navigation/AuthStackNavigator';
import { autoLogIn } from './features/auth/authSlice';
import { colors } from '@globals/style';

export const Main: FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useLayoutEffect(() => {
    dispatch(autoLogIn());
  }, []);

  if (auth.status === 'loading') {
    return <ActivityIndicator size="large" color={colors.blue.dark} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        {auth.isLoggedIn ? <TabNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
