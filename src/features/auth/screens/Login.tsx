import { colors } from '@globals/style';
import Button from '@shared/Button';
import Input from '@shared/Input';
import { FC, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

interface InputField {
  value: string;
  valid: boolean;
  blurred: boolean;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginScreen: FC = () => {
  const [email, setEmail] = useState<InputField>({ value: '', valid: false, blurred: false });
  const [password, setPassword] = useState<InputField>({ value: '', valid: false, blurred: false });

  function handleEmailChange(text: string): void {
    setEmail({ value: text, valid: emailRegex.test(email.value), blurred: false });
  }

  function handleEmailBlurr(): void {
    setEmail(prevState => {
      return { ...prevState, blurred: true };
    });
  }

  function handlePasswordChange(text: string): void {
    setPassword({ value: text, valid: text.length >= 5, blurred: false });
  }

  function handlePasswordBlurr(): void {
    setPassword(prevState => {
      return { ...prevState, blurred: true };
    });
  }

  function login(): void {}

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        style={[styles.input, !email.valid && email.blurred ? styles.error : styles.valid]}
        placeholder="Email"
        onChangeText={handleEmailChange}
        onBlur={handleEmailBlurr}
      />
      <Input
        style={[styles.input, !password.valid && password.blurred ? styles.error : styles.valid]}
        placeholder="Password"
        onChangeText={handlePasswordChange}
        onBlur={handlePasswordBlurr}
      />
      <Button
        text="Login"
        onPress={login}
        primary
        style={styles.button}
        disabled={!email.valid || !password.valid}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    width: '100%',
  },
  valid: {
    borderColor: colors.blue.dark,
  },
  error: {
    borderColor: 'red',
  },
});
