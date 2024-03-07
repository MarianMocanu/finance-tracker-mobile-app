import * as SecureStore from 'expo-secure-store';

export const saveTokenInStorage = async (token: string) => {
  await SecureStore.setItemAsync('token', token);
};

export const getTokenFromStorage = async () => {
  return await SecureStore.getItemAsync('token');
};

export const deleteTokenFromStorage = async () => {
  await SecureStore.deleteItemAsync('token');
};
