import { StatusBar } from 'expo-status-bar';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import TabNavigation from './navigation/TabNavigator';

export const Main: FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TabNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
