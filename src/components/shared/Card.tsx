import { FC, PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props extends PropsWithChildren {
  borderColor?: string;
  style?: ViewStyle;
}

const Card: FC<Props> = ({ borderColor, style, children }) => {
  return <View style={[styles.card, style, { borderColor }]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
    height: 80,
    borderWidth: 1,
  },
});
