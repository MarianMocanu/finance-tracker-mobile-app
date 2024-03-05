import { FC, PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../globals/style';

interface Props extends PropsWithChildren {
  text?: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}

const Button: FC<Props> = ({
  text,
  onPress,
  style,
  textStyle,
  children,
  primary,
  secondary,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        primary && styles.primary,
        secondary && styles.secondary,
        style,
        disabled && { opacity: 0.5 },
      ]}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <Text style={[primary && styles.textPrimary, secondary && styles.textSecondary, textStyle]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 48,
    backgroundColor: colors.blue.dark,
    paddingHorizontal: 24,
  },
  secondary: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 48,
    backgroundColor: colors.blue.light,
    paddingHorizontal: 24,
  },
  textPrimary: {
    fontSize: 16,
    lineHeight: 18,
    color: '#FFF',
  },
  textSecondary: {
    fontSize: 16,
    lineHeight: 18,
    color: '#000',
  },
});
