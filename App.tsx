import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import TabNavigation from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <TabNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
