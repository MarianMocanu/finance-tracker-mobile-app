import { StatusBar } from 'expo-status-bar';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import TabNavigator from './navigation/TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './app/store';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './navigation/AuthStackNavigator';

export const Main: FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  console.log(JSON.stringify(auth, null, 2));

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
