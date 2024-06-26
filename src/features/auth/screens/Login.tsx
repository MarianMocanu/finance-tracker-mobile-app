import { colors } from '@globals/style';
import Button from '@shared/Button';
import Input from '@shared/Input';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from 'src/navigation/AuthStackNavigator';
import { logIn, signUp } from '../authSlice';

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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    dispatch(logIn({ email, password })).finally(() => {
      setLoading(false);
    });
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
      <Button text="New user? Create account here" onPress={navigateToSignup} style={styles.signup}>
        <View style={styles.signupText}>
          <Text>Don't have an account?</Text>
          <Text style={styles.signupHighlight}>Sign up here.</Text>
        </View>
      </Button>
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
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  signupText: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  signupHighlight: {
    color: colors.blue.base,
  },
});
