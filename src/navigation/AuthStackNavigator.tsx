import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'src/features/auth/screens/Login';
import { SignupScreen } from 'src/features/auth/screens/Signup';

export type AuthStackParamList = {
  login: {
    email: string;
    password: string;
  };
  signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
