import { colors } from '@globals/style';
import Button from '@shared/Button';
import Input from '@shared/Input';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from 'src/navigation/AuthStackNavigator';
import { logIn } from '../authSlice';

interface InputField {
  value: string;
  valid: boolean;
  blurred: boolean;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList, 'login'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'login'>>();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<InputField>({
    value: '',
    valid: false,
    blurred: false,
  });
  const [password, setPassword] = useState<InputField>({
    value: '',
    valid: false,
    blurred: false,
  });

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

  function handleLogin(email: string, password: string): void {
    dispatch(logIn({ email, password }));
  }

  function navigateToSignup(): void {
    navigation.navigate('signup');
  }

  useEffect(() => {
    if (route.params && route.params.email && route.params.password) {
      handleLogin(route.params.email, route.params.password);
    }
  }, [route.params]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Button
        text="New user? Create account here"
        onPress={navigateToSignup}
        style={styles.signup}
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
        text="Login"
        onPress={() => handleLogin(email.value, password.value)}
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
  signup: {
    alignSelf: 'center',
  },
});
