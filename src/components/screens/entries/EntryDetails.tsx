import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const EntryDetailsScreen: FC = () => {
  return (
    <View style={style.container}>
      <Text>Here is the entry details screen</Text>
    </View>
  );
};

export default EntryDetailsScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
  },
});
