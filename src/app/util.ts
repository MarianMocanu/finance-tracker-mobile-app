import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('@token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('@token');
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync('@token');
};
