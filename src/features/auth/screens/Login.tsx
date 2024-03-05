import { colors } from '@globals/style';
import Button from '@shared/Button';
import Input from '@shared/Input';
import { FC, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { login } from '../authSlice';

interface InputField {
  value: string;
  valid: boolean;
  blurred: boolean;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  function handleLogin(): void {
    dispatch(login());
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        style={[styles.input, email.blurred && (email.valid ? styles.valid : styles.error)]}
        placeholder="Email"
        onChangeText={handleEmailChange}
        onBlur={handleEmailBlurr}
      />
      <Input
        style={[styles.input, password.blurred && (password.valid ? styles.valid : styles.error)]}
        placeholder="Password"
        onChangeText={handlePasswordChange}
        onBlur={handlePasswordBlurr}
      />
      <Button
        text="Login"
        onPress={handleLogin}
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
  valid: {
    borderColor: colors.blue.dark,
  },
  error: {
    borderColor: 'red',
  },
});
