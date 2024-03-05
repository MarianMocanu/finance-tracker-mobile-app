import { colors } from '@globals/style';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

type Props = PropsWithChildren<TextInputProps>;

const Input = React.forwardRef<TextInput, Props>(
  ({ style, placeholderTextColor, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor ?? colors.text.light}
        {...props}
      />
    );
  },
);

export default Input;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.text.dark,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    height: 48,
    width: '100%',
  },
});
