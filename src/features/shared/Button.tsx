import { FC } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../globals/style';

type Props = {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button: FC<Props> = ({ text, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 46,
    backgroundColor: colors.blue.dark,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 18,
    color: '#FFF',
  },
});
