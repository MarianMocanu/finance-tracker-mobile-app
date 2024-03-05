import { colors } from '@globals/style';
import Button from '@shared/Button';
import Input from '@shared/Input';
import { FC, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { signUp } from '../authSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'src/navigation/AuthStackNavigator';

interface InputField {
  value: string;
  valid: boolean;
  blurred: boolean;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const SignupScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList, 'signup'>>();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState<InputField>({ value: '', valid: false, blurred: false });
  const [email, setEmail] = useState<InputField>({ value: '', valid: false, blurred: false });
  const [password, setPassword] = useState<InputField>({ value: '', valid: false, blurred: false });

  function handleNameChange(text: string): void {
    setName({ value: text, valid: text.length > 3, blurred: false });
  }

  function handleNameBlur(): void {
    setName(prevState => {
      return { ...prevState, blurred: true };
    });
  }

  function handleEmailChange(text: string): void {
    setEmail({ value: text, valid: emailRegex.test(email.value), blurred: false });
  }

  function handleEmailBlur(): void {
    setEmail(prevState => {
      return { ...prevState, blurred: true };
    });
  }

  function handlePasswordChange(text: string): void {
    setPassword({ value: text, valid: text.length >= 5, blurred: false });
  }

  function handlePasswordBlur(): void {
    setPassword(prevState => {
      return { ...prevState, blurred: true };
    });
  }

  async function handleSignup(): Promise<void> {
    const user = { name: name.value, email: email.value, password: password.value };
    await dispatch(signUp(user));
    navigation.navigate('login', { email: email.value, password: password.value });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Input
        style={[styles.input, name.blurred && (name.valid ? styles.valid : styles.error)]}
        placeholder="Name"
        onChangeText={handleNameChange}
        onBlur={handleNameBlur}
      />
      <Input
        style={[styles.input, email.blurred && (email.valid ? styles.valid : styles.error)]}
        placeholder="Email"
        onChangeText={handleEmailChange}
        onBlur={handleEmailBlur}
      />
      <Input
        style={[styles.input, password.blurred && (password.valid ? styles.valid : styles.error)]}
        placeholder="Password"
        onChangeText={handlePasswordChange}
        onBlur={handlePasswordBlur}
      />
      <Button
        text="Create account"
        onPress={handleSignup}
        primary
        style={styles.button}
        disabled={!email.valid || !password.valid || !name.valid}
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
  signup: {
    alignSelf: 'center',
  },
});
