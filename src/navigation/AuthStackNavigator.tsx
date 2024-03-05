import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'src/features/auth/screens/Login';

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      {/* <Stack.Screen name="signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
}
