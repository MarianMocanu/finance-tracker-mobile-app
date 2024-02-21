import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const Account: FC = () => {
  return (
    <View style={style.container}>
      <Text>Here is the profile screen</Text>
    </View>
  );
};

export default Account;

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
